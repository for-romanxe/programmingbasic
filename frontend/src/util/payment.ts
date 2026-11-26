import { ko } from "../lang/ko";
import type { OrderMakingReceiveBitcoinBody } from "./order";
export const bitcoinPaymentURI = (payment: OrderMakingReceiveBitcoinBody) =>
  `bitcoin:${payment.catchAddress}?amount=${encodeURIComponent(payment.amountBTC)}`;
export const paymentStatusLabel = (status: 0 | 1 | 2) =>
  ko.paymentStatuses[status];
