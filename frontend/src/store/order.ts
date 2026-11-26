import { create } from "zustand";
import type { MenuModel, ReservationTargetModel } from "../util/types";

type State = {
  cart: { menu: MenuModel; quantity: number }[];
  reservation: ReservationTargetModel | null;
  add: (menu: MenuModel) => void;
  change: (id: number, delta: number) => void;
  remove: (id: number) => void;
  selectReservation: (slot: ReservationTargetModel) => void;
  clear: () => void;
};
export const useOrderStore = create<State>((set) => ({
  cart: [],
  reservation: null,
  add: (menu) =>
    set((s) => ({
      cart: s.cart.some((i) => i.menu.id === menu.id)
        ? s.cart.map((i) =>
            i.menu.id === menu.id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [...s.cart, { menu, quantity: 1 }],
    })),
  change: (id, delta) =>
    set((s) => ({
      cart: s.cart
        .map((i) =>
          i.menu.id === id
            ? { ...i, quantity: Math.max(0, i.quantity + delta) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    })),
  remove: (id) =>
    set((s) => ({ cart: s.cart.filter((i) => i.menu.id !== id) })),
  selectReservation: (reservation) => set({ reservation }),
  clear: () => set({ cart: [], reservation: null }),
}));
