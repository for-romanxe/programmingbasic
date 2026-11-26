import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  saveOrderStorage,
  loadOrderStorage,
  clearOrderStorage,
} from "../src/util/order-storage";
import { bitcoinPaymentURI, paymentStatusLabel } from "../src/util/payment";
import { request } from "../src/api/client";
const phrase = { a: 0, b: 42, c: 4294967295, d: 7 };
function storageMock(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => {
      data.delete(k);
    },
    setItem: (k, v) => {
      data.set(k, String(v));
    },
  };
}
let storage: Storage;
beforeEach(() => {
  storage = storageMock();
  vi.stubGlobal("localStorage", storage);
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
describe("계획서 니모닉 저장 계약", () => {
  it("m1~m4 문자열과 초 단위 exp로 저장하고 복원한다", () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    saveOrderStorage(phrase, exp);
    expect(storage.length).toBe(5);
    expect(storage.getItem("m1")).toBe("0");
    expect(storage.getItem("exp")).toBe(String(exp));
    expect(loadOrderStorage()).toEqual(phrase);
  });
  it.each(["m1", "m2", "m3", "m4", "exp"])(
    "%s 누락은 손상으로 처리하고 모든 키를 삭제한다",
    (key) => {
      saveOrderStorage(phrase, Math.floor(Date.now() / 1000) + 3600);
      storage.removeItem(key);
      expect(loadOrderStorage()).toBeNull();
      expect(storage.length).toBe(0);
    },
  );
  it.each(["", "-1", "1.5", "NaN", "Infinity", "4294967296"])(
    "잘못된 니모닉 %s를 거부한다",
    (value) => {
      saveOrderStorage(phrase, Math.floor(Date.now() / 1000) + 3600);
      storage.setItem("m2", value);
      expect(loadOrderStorage()).toBeNull();
      expect(storage.length).toBe(0);
    },
  );
  it("만료 정보는 삭제하고 다른 앱 키는 보존한다", () => {
    saveOrderStorage(phrase, Math.floor(Date.now() / 1000) - 1);
    storage.setItem("other", "keep");
    expect(loadOrderStorage()).toBeNull();
    expect(storage.getItem("other")).toBe("keep");
    expect(storage.length).toBe(1);
  });
  it("중간 저장 실패 시 이전 조회 정보를 복원한다", () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    saveOrderStorage(phrase, exp);
    const real = storage.setItem.bind(storage);
    let failed = false;
    vi.spyOn(storage, "setItem").mockImplementation((key, value) => {
      if (key === "m3" && !failed) {
        failed = true;
        throw new Error("quota");
      }
      real(key, value);
    });
    expect(() => saveOrderStorage({ ...phrase, b: 99 }, exp)).toThrow("quota");
    expect(loadOrderStorage()).toEqual(phrase);
  });
  it("키 삭제는 주문 데이터와 무관하다", () => {
    storage.setItem("orders", "keep");
    saveOrderStorage(phrase, Math.floor(Date.now() / 1000) + 3600);
    clearOrderStorage();
    expect(storage.length).toBe(1);
  });
});
describe("결제 및 HTTP 계약", () => {
  it("서버의 BTC 문자열 정밀도를 유지해 QR payload를 만든다", () => {
    expect(
      bitcoinPaymentURI({
        id: 1,
        catchAddress: "test-address",
        amountBTC: "0.00010500",
      }),
    ).toBe("bitcoin:test-address?amount=0.00010500");
  });
  it("대기·성공·실패 상태를 구분한다", () => {
    expect([0, 1, 2].map((s) => paymentStatusLabel(s as 0 | 1 | 2))).toEqual([
      "입금 대기",
      "결제 확인",
      "결제 실패",
    ]);
  });
  it("네트워크 오류는 연결 확인 문구를 제공한다", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network")));
    await expect(request("/menus")).rejects.toThrow("인터넷 연결");
  });
  it("서버 거절 사유를 그대로 전달한다", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({ ok: false, error: "마감된 시간대입니다." }),
            { status: 409 },
          ),
        ),
    );
    await expect(request("/orders", {})).rejects.toThrow("마감된 시간대");
  });
  it("계획서의 요청 형식과 Option 응답을 처리한다", async () => {
    const fetch = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ ok: true, data: { status: 1 } })),
      );
    vi.stubGlobal("fetch", fetch);
    await expect(
      request("/orders/check", { passphrase: phrase }),
    ).resolves.toEqual({ status: 1 });
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe("/api/orders/check");
    expect(JSON.parse(options.body)).toEqual({ passphrase: phrase });
  });
});
