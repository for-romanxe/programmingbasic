export type ReservationID = number;
export type ReservationStartTime = string;
export type ReservationEndTime = string;
export type ReservationCapacity = number;
export type ReservationRemaining = number;
export type ReservationTargetModel = {
  id: ReservationID;
  startTime: ReservationStartTime;
  endTime: ReservationEndTime;
  capacity: ReservationCapacity;
  remaining: ReservationRemaining;
};
export type ReservationListModel = { list: ReservationTargetModel[] };
