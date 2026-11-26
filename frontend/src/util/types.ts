export type * from "./menu";
export type * from "./reservation";
export type * from "./order";
export type PaymentMethod = 0 | 1;
export const won = (value: number) => `${value.toLocaleString("ko-KR")}원`;
export const timeLabel = (value: string) =>
  new Date(value).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
export const phraseText = (p: import("./order").OrderPassphrase) =>
  [p.a, p.b, p.c, p.d].join(" ");
