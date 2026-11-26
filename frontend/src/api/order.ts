import type {
  OrderMakingSendModel,
  OrderMakingReceiveModel,
  OrderCheckSendModel,
  OrderCheckReceiveModel,
} from "../util/order";
import { request, serverMode } from "./client";
import { DemoOrderAPI } from "./demo";
export const OrderAPI = {
  MakeOrder: (input: OrderMakingSendModel): Promise<OrderMakingReceiveModel> =>
    serverMode ? request("/orders", input) : DemoOrderAPI.MakeOrder(input),
  CheckOrder: (input: OrderCheckSendModel): Promise<OrderCheckReceiveModel> =>
    serverMode
      ? request("/orders/check", input)
      : DemoOrderAPI.CheckOrder(input),
};
