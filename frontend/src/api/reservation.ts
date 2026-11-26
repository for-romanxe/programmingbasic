import type { ReservationListModel } from "../util/reservation";
import { request, serverMode } from "./client";
import { DemoReservationAPI } from "./demo";
export const ReservationAPI = {
  ReadAllReservationTargets: (): Promise<ReservationListModel> =>
    serverMode
      ? request("/reservations")
      : DemoReservationAPI.ReadAllReservationTargets(),
};
