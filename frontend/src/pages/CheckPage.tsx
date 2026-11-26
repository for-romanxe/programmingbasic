import { useEffect, useState } from "react";
import {
  Bank,
  Clock,
  Copy,
  Info,
  Receipt,
  MagnifyingGlass,
  CheckCircle,
  WarningCircle,
  ArrowClockwise,
} from "@phosphor-icons/react";
import { useSearchParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { OrderAPI } from "../api/order";
import { serverMode } from "../api/client";
import { Message, Modal, PageTitle } from "../components/Ui";
import {
  UserButton,
  UserColoredButton,
  UserLink,
} from "../elements/UserButton";
import {
  clearOrderStorage,
  loadOrderStorage,
  saveOrderStorage,
} from "../util/order-storage";
import { bitcoinPaymentURI, paymentStatusLabel } from "../util/payment";
import { useOrderStore } from "../store/order";
import {
  phraseText,
  timeLabel,
  won,
  type CheckedOrder,
  type OrderPassphrase,
} from "../util/types";
function Status({ value }: { value: 0 | 1 | 2 }) {
  const Icon = value === 1 ? CheckCircle : value === 2 ? WarningCircle : Clock;
  return (
    <span className={`pending-tag payment-status--${value}`}>
      <Icon size={17} />
      {paymentStatusLabel(value)}
    </span>
  );
}
function PaymentDetails({
  order,
  onClose,
}: {
  order: CheckedOrder;
  onClose: () => void;
}) {
  const [copyResult, setCopyResult] = useState("");
  const payment = order.payment;
  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyResult(`${label}를 복사했어요.`);
    } catch {
      setCopyResult("복사하지 못했어요. 내용을 직접 선택해 복사해 주세요.");
    }
  }
  return (
    <Modal
      title={payment.id === 1 ? "비트코인 결제 안내" : "무통장입금 안내"}
      onClose={onClose}
    >
      <div className="modal-amount">
        <span>{serverMode ? "입금할 금액" : "시연용 예시 금액"}</span>
        <strong>
          {payment.id === 1 ? `${payment.amountBTC} BTC` : won(payment.amount)}
        </strong>
        <Status value={payment.status} />
      </div>
      {payment.id === 1 ? (
        <>
          <div className="demo-qr">
            <QRCodeSVG
              value={bitcoinPaymentURI(payment)}
              size={180}
              marginSize={4}
              level="M"
              title="입금 주소와 BTC 금액을 담은 결제 QR"
            />
            <span>
              {serverMode
                ? "비트코인 결제 QR"
                : "시연 데이터 QR · 실제 송금 불가"}
            </span>
          </div>
          <div className="detail-block">
            <span>입금 주소</span>
            <strong style={{ overflowWrap: "anywhere" }}>
              {payment.catchAddress}
            </strong>
            <UserButton
              variant="quiet"
              onClick={() => copy(payment.catchAddress, "입금 주소")}
            >
              <Copy size={17} />
              주소 복사
            </UserButton>
          </div>
        </>
      ) : (
        <div className="detail-block">
          <span>입금 계좌</span>
          <strong>{payment.catchDeposit}</strong>
          <UserButton
            variant="quiet"
            onClick={() => copy(payment.catchDeposit, "입금 안내")}
          >
            <Copy size={17} />
            입금 안내 복사
          </UserButton>
        </div>
      )}
      <p className="inline-note">
        <Info size={16} />
        {serverMode
          ? "입금 확인 처리 후 주문을 다시 조회하면 결제 상태가 갱신됩니다."
          : "시연용 입금 정보입니다. 실제로 송금하지 마세요."}
      </p>
      <section className="passphrase">
        <div>
          <h3>주문 조회용 니모닉</h3>
          <UserButton
            variant="quiet"
            onClick={() => copy(phraseText(order.passphrase), "조회 코드")}
            aria-label="주문 조회 코드 복사"
          >
            <Copy size={17} />
            복사
          </UserButton>
        </div>
        <div className="code-chips">
          {Object.values(order.passphrase).map((value, i) => (
            <span key={i}>{value}</span>
          ))}
        </div>
        <p>이 네 숫자로 로그인 없이 주문을 확인해요.</p>
      </section>
      {copyResult && <Message>{copyResult}</Message>}
      <UserColoredButton className="full-width" onClick={onClose}>
        주문 상태 확인
      </UserColoredButton>
    </Modal>
  );
}
export function CheckPage() {
  const [search, setSearch] = useSearchParams();
  const [order, setOrder] = useState<CheckedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const clearCart = useOrderStore((s) => s.clear);
  const autoOpen = search.get("payment") === "1";
  useEffect(() => {
    let cancelled = false;
    const saved = loadOrderStorage();
    if (!saved) {
      setLoading(false);
      return;
    }
    OrderAPI.CheckOrder({ passphrase: saved })
      .then((value) => {
        if (!cancelled) {
          setOrder({ ...value, passphrase: saved });
          setShowPayment(autoOpen);
          if (autoOpen) clearCart();
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setOrder(null);
          clearOrderStorage();
          setError(e instanceof Error ? e.message : "주문 조회에 실패했어요.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  function closePayment() {
    setShowPayment(false);
    if (autoOpen) setSearch({}, { replace: true });
  }
  async function fetchOrder(passphrase: OrderPassphrase) {
    setError("");
    setLoading(true);
    try {
      const value = await OrderAPI.CheckOrder({ passphrase });
      setOrder({ ...value, passphrase });
      try {
        saveOrderStorage(passphrase, Math.floor(Date.now() / 1000) + 3600);
      } catch {
        setError("주문은 조회했지만 자동 조회 정보를 저장하지 못했어요.");
      }
    } catch (e) {
      setOrder(null);
      clearOrderStorage();
      setError(e instanceof Error ? e.message : "주문을 조회하지 못했어요.");
    } finally {
      setLoading(false);
    }
  }
  function lookup(event: React.FormEvent) {
    event.preventDefault();
    const parts = input.trim().split(/[\s,-]+/);
    if (
      parts.length !== 4 ||
      parts.some((p) => !/^\d+$/.test(p) || Number(p) > 4294967295)
    ) {
      setError("숫자 네 개를 공백으로 구분해 입력해 주세요.");
      return;
    }
    const [a, b, c, d] = parts.map(Number);
    void fetchOrder({ a, b, c, d });
  }
  return (
    <div className="page check-page">
      <PageTitle
        title="주문 조회"
        description="내가 주문한 한 끼, 여기서 확인하세요."
        back="/"
      />
      {loading ? (
        <Message>주문 정보를 확인하고 있어요.</Message>
      ) : order ? (
        <>
          <section className="order-status">
            <span className="receipt-icon">
              <Receipt size={33} />
            </span>
            <span className="eyebrow">
              {serverMode ? "주문 접수 완료" : "시연 주문 접수 완료"}
            </span>
            <h2>
              {order.status === 1
                ? "결제가 확인됐어요."
                : order.status === 2
                  ? "결제를 완료하지 못했어요."
                  : "한 끼를 미리 예약했어요."}
            </h2>
            <p>
              {serverMode
                ? "입금 확인 결과는 주문 상태 다시 확인으로 조회해 주세요."
                : "실제 주문·조리·결제는 진행되지 않아요."}
            </p>
            <Status value={order.status} />
          </section>
          <section className="check-details">
            <div>
              <span>방문 시간</span>
              <strong>
                {new Date(order.reservation.startTime).toLocaleDateString(
                  "ko-KR",
                  { month: "long", day: "numeric" },
                )}{" "}
                {timeLabel(order.reservation.startTime)}
              </strong>
            </div>
            <div>
              <span>결제 방법</span>
              <strong>
                {order.payment.id === 0 ? "무통장입금" : "비트코인"}
              </strong>
            </div>
            <div>
              <span>결제 상태</span>
              <Status value={order.payment.status} />
            </div>
            <div className="check-total">
              <span>총 주문 금액</span>
              <strong>{won(order.totalPrice)}</strong>
            </div>
          </section>
          <div className="check-actions">
            <UserColoredButton onClick={() => setShowPayment(true)}>
              <Bank size={20} />
              결제 안내 보기
            </UserColoredButton>
            <UserButton
              onClick={() => fetchOrder(order.passphrase)}
              disabled={loading}
            >
              <ArrowClockwise size={20} />
              주문 상태 다시 확인
            </UserButton>
          </div>
          <UserLink to="/menu">메뉴 다시 보기</UserLink>
        </>
      ) : (
        <div className="lookup-intro">
          <MagnifyingGlass size={42} weight="light" />
          <h2>주문 조회 코드를 입력해 주세요.</h2>
          <p>주문 접수 때 발급된 네 숫자로 확인할 수 있어요.</p>
        </div>
      )}
      <form onSubmit={lookup} className="lookup-form">
        <label htmlFor="passphrase">
          {order ? "다른 주문 조회하기" : "주문 조회 코드"}
        </label>
        <div>
          <input
            id="passphrase"
            autoComplete="off"
            placeholder="숫자 4개를 공백으로 구분해 입력"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <UserButton type="submit" disabled={loading || !input.trim()}>
            조회
          </UserButton>
        </div>
        <small>자동 조회 정보는 현재 브라우저에 1시간 보관됩니다.</small>
      </form>
      {error && <Message error>{error}</Message>}
      {order && showPayment && (
        <PaymentDetails order={order} onClose={closePayment} />
      )}
    </div>
  );
}
