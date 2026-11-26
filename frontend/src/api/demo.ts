import type {
  MenuModel,
  SectionModel,
  ReservationListModel,
  OrderMakingSendModel,
  OrderMakingReceiveModel,
  OrderCheckReceiveModel,
  OrderPassphrase,
  OrderCheckSendModel,
} from "../util/types";
type StoredOrder = OrderMakingReceiveModel & OrderCheckReceiveModel;
const menus: MenuModel[] = [
  {
    id: 1,
    name: "직화 제육덮밥",
    section: "만권화밥",
    price: 5000,
    photo: "pork",
    image: { src: "sprite:pork", alt: "시연 메뉴 사진" },
    description: "매콤한 직화 제육과 따뜻한 한 공기",
    tag: "인기 메뉴",
  },
  {
    id: 2,
    name: "비빔밥",
    section: "만권화밥",
    price: 5000,
    photo: "bibimbap",
    image: { src: "sprite:bibimbap", alt: "시연 메뉴 사진" },
    description: "아삭한 채소와 고소한 달걀의 조화",
  },
  {
    id: 3,
    name: "수제 돈가스",
    section: "숑숑돈까스",
    price: 5500,
    photo: "cutlet",
    image: { src: "sprite:cutlet", alt: "시연 메뉴 사진" },
    description: "바삭한 돈가스에 깊은 풍미의 소스",
    tag: "인기 메뉴",
  },
  {
    id: 4,
    name: "돈가스 정식",
    section: "숑숑돈까스",
    price: 6500,
    photo: "cutlet",
    image: { src: "sprite:cutlet", alt: "시연 메뉴 사진" },
    description: "든든한 돈가스와 밥, 곁들임 샐러드",
  },
  {
    id: 5,
    name: "신머이 쌀국수",
    section: "위델가",
    price: 6000,
    photo: "noodle",
    image: { src: "sprite:noodle", alt: "시연 메뉴 사진" },
    description: "맑고 진한 육수에 부드러운 쌀국수",
    tag: "추천 메뉴",
  },
  {
    id: 6,
    name: "쌀국수 세트",
    section: "위델가",
    price: 7500,
    photo: "noodle",
    image: { src: "sprite:noodle", alt: "시연 메뉴 사진" },
    description: "쌀국수와 함께 즐기는 든든한 세트",
  },
];

const ORDER_KEY = "kgu-demo-orders-v2";
const pause = () => new Promise((resolve) => setTimeout(resolve, 220));
const readOrders = (): StoredOrder[] => {
  try {
    const data = JSON.parse(localStorage.getItem(ORDER_KEY) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};
const samePhrase = (a: OrderPassphrase, b: OrderPassphrase) =>
  ["a", "b", "c", "d"].every(
    (k) => a[k as keyof OrderPassphrase] === b[k as keyof OrderPassphrase],
  );
export const DemoMenuAPI = {
  async ReadAllMenus(): Promise<SectionModel[]> {
    await pause();
    return (["만권화밥", "숑숑돈까스", "위델가"] as const).map((name) => ({
      name,
      list: menus.filter((menu) => menu.section === name),
    }));
  },
};
export const DemoReservationAPI = {
  async ReadAllReservationTargets(): Promise<ReservationListModel> {
    await pause();
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const booked = readOrders();
    return {
      list: [11.5, 12, 12.5, 13].map((hour, i) => {
        const start = new Date(date);
        start.setHours(Math.floor(hour), hour % 1 ? 30 : 0, 0, 0);
        const end = new Date(start.getTime() + 1800000);
        return {
          id: i + 1,
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          capacity: 20,
          remaining: Math.max(
            0,
            [12, 8, 5, 0][i] -
              booked.filter(
                (o) => o.reservation.startTime === start.toISOString(),
              ).length,
          ),
        };
      }),
    };
  },
};
export const DemoOrderAPI = {
  async MakeOrder(
    input: OrderMakingSendModel,
  ): Promise<OrderMakingReceiveModel> {
    const { list } = await DemoReservationAPI.ReadAllReservationTargets();
    const slot = list.find((s) => s.id === input.reservation);
    if (!slot || slot.remaining < 1)
      throw new Error("선택한 시간이 마감됐어요. 다른 시간을 선택해 주세요.");
    if (!input.menus.length) throw new Error("메뉴를 먼저 담아 주세요.");
    if (input.paymentMethod.id === 0 && input.paymentMethod.body.wantFailed)
      throw new Error("요청한 결제 실패로 주문을 접수하지 않았어요.");
    const items = input.menus.map((item) => {
      const menu = menus.find((m) => m.id === item.id);
      if (!menu || !Number.isInteger(item.quantity) || item.quantity < 1)
        throw new Error("메뉴와 수량을 다시 확인해 주세요.");
      return { menu, quantity: item.quantity };
    });
    const total = items.reduce((sum, i) => sum + i.menu.price * i.quantity, 0);
    const existing = readOrders();
    let phrase: OrderPassphrase;
    do {
      const values = crypto.getRandomValues(new Uint32Array(4));
      phrase = { a: values[0], b: values[1], c: values[2], d: values[3] };
    } while (existing.some((o) => samePhrase(o.passphrase, phrase)));
    const payment =
      input.paymentMethod.id === 0
        ? {
            id: 0 as const,
            catchDeposit: "데모은행 000-0000-000000 / 경슐랭 학생식당 (시연)",
            amount: total,
            status: 0 as const,
          }
        : {
            id: 1 as const,
            catchAddress: "DEMO-NOT-A-BITCOIN-ADDRESS",
            amountBTC: (total / 100000000).toFixed(8),
            status: 0 as const,
          };
    const order: StoredOrder = {
      passphrase: phrase,
      expiresAt: Math.floor(Date.now() / 1000) + 3600,
      totalPrice: total,
      payment,
      reservation: slot,
      status: 0,
    };
    try {
      localStorage.setItem(ORDER_KEY, JSON.stringify([...existing, order]));
    } catch {
      throw new Error("브라우저에 주문을 저장할 수 없어요.");
    }
    return {
      passphrase: order.passphrase,
      expiresAt: order.expiresAt,
      totalPrice: total,
      payment,
    };
  },
  async CheckOrder({
    passphrase,
  }: OrderCheckSendModel): Promise<OrderCheckReceiveModel> {
    await pause();
    const order = readOrders().find((o) =>
      samePhrase(o.passphrase, passphrase),
    );
    if (!order)
      throw new Error(
        "일치하는 시연 주문을 찾지 못했어요. 조회 코드를 확인해 주세요.",
      );
    return {
      status: order.status,
      totalPrice: order.totalPrice,
      reservation: order.reservation,
      payment: order.payment,
    };
  },
};
