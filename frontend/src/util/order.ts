import type { MenuID } from "./menu";
import type { ReservationID, ReservationTargetModel } from "./reservation";
export type OrderPassphraseID = number;
export type OrderPassphrase = {
  a: OrderPassphraseID;
  b: OrderPassphraseID;
  c: OrderPassphraseID;
  d: OrderPassphraseID;
};
export type OrderMakingMenuID = MenuID;
export type OrderMakingMenuQuantity = number;
export type OrderMakingMenuPair = {
  id: OrderMakingMenuID;
  quantity: OrderMakingMenuQuantity;
};
export type OrderMakingReservationID = ReservationID;
export type OrderMakingPaymentMethodTransferID = 0;
export type OrderMakingPaymentMethodTransferBody = { wantFailed: boolean };
export type OrderMakingPaymentMethodTransfer = {
  id: OrderMakingPaymentMethodTransferID;
  body: OrderMakingPaymentMethodTransferBody;
};
export type OrderMakingPaymentMethodBitcoinID = 1;
export type OrderMakingPaymentMethodBitcoin = {
  id: OrderMakingPaymentMethodBitcoinID;
};
export type OrderMakingPaymentMethod =
  OrderMakingPaymentMethodTransfer | OrderMakingPaymentMethodBitcoin;
export type OrderMakingSendModel = {
  menus: OrderMakingMenuPair[];
  reservation: OrderMakingReservationID;
  paymentMethod: OrderMakingPaymentMethod;
};
export type OrderMakingReceiveTransferBody = {
  id: 0;
  catchDeposit: string;
  amount: number;
};
export type OrderMakingReceiveBitcoinBody = {
  id: 1;
  catchAddress: string;
  amountBTC: string;
};
export type OrderMakingReceiveBody =
  OrderMakingReceiveTransferBody | OrderMakingReceiveBitcoinBody;
export type OrderMakingReceiveModel = {
  passphrase: OrderPassphrase;
  totalPrice: number;
  expiresAt: number;
  payment: OrderMakingReceiveBody;
};
export type OrderStatusID = 0 | 1 | 2;
export type OrderCheckSendModel = { passphrase: OrderPassphrase };
export type OrderCheckReceiveModel = {
  status: OrderStatusID;
  totalPrice: number;
  reservation: ReservationTargetModel;
  payment: OrderMakingReceiveBody & { status: OrderStatusID };
};
export type CheckedOrder = OrderCheckReceiveModel & {
  passphrase: OrderPassphrase;
};
