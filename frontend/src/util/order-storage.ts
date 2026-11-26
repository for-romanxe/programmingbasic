import type { OrderPassphrase } from "./order";
const keys = ["m1", "m2", "m3", "m4", "exp"] as const;
export function clearOrderStorage(storage: Storage = localStorage) {
  for (const key of keys) {
    try {
      storage.removeItem(key);
    } catch {
      /* 저장소 사용이 차단돼도 수동 조회는 제공한다. */
    }
  }
}
export function saveOrderStorage(
  phrase: OrderPassphrase,
  expiresAt: number,
  storage: Storage = localStorage,
) {
  const previous = keys.map((key) => storage.getItem(key));
  const values = [phrase.a, phrase.b, phrase.c, phrase.d, expiresAt].map(
    String,
  );
  try {
    keys.forEach((key, i) => storage.setItem(key, values[i]));
  } catch (error) {
    keys.forEach((key, i) => {
      try {
        const value = previous[i];
        if (value === null) storage.removeItem(key);
        else storage.setItem(key, value);
      } catch {}
    });
    throw error;
  }
}
export function loadOrderStorage(
  storage: Storage = localStorage,
): OrderPassphrase | null {
  try {
    const values = keys.map((key) => storage.getItem(key));
    if (values.every((v) => v === null)) return null;
    if (values.some((v) => v === null || !/^(0|[1-9]\d*)$/.test(v))) {
      clearOrderStorage(storage);
      return null;
    }
    const numbers = values.map(Number);
    if (
      numbers.some((n) => !Number.isSafeInteger(n)) ||
      numbers.slice(0, 4).some((n) => n > 4294967295) ||
      numbers[4] <= Math.floor(Date.now() / 1000)
    ) {
      clearOrderStorage(storage);
      return null;
    }
    return { a: numbers[0], b: numbers[1], c: numbers[2], d: numbers[3] };
  } catch {
    return null;
  }
}
