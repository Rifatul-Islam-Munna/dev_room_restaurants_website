
import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  subtitle?: string;
  price: string;
  priceNum: number;
  image?: string;
  chefsPick?: boolean;
  category?: string;
  quantity: number;
};

type AddToCartPayload = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartStore = {
  items: CartItem[];

  addToCart: (item: AddToCartPayload) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeFromCart: (id: string) => void;
  setQty: (id: string, quantity: number) => void;
  clearCart: () => void;

  getItemQty: (id: string) => number;
  isInCart: (id: string) => boolean;

  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],

  addToCart: (item) =>
    set((state) => {
      const qtyToAdd = item.quantity ?? 1;
      const existing = state.items.find((x) => x.id === item.id);

      if (existing) {
        return {
          items: state.items.map((x) =>
            x.id === item.id
              ? { ...x, quantity: x.quantity + qtyToAdd }
              : x
          ),
        };
      }

      return {
        items: [...state.items, { ...item, quantity: qtyToAdd }],
      };
    }),

  increaseQty: (id) =>
    set((state) => ({
      items: state.items.map((x) =>
        x.id === id ? { ...x, quantity: x.quantity + 1 } : x
      ),
    })),

  decreaseQty: (id) =>
    set((state) => ({
      items: state.items
        .map((x) =>
          x.id === id ? { ...x, quantity: x.quantity - 1 } : x
        )
        .filter((x) => x.quantity > 0),
    })),

  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((x) => x.id !== id),
    })),

  setQty: (id, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return {
          items: state.items.filter((x) => x.id !== id),
        };
      }

      return {
        items: state.items.map((x) =>
          x.id === id ? { ...x, quantity } : x
        ),
      };
    }),

  clearCart: () => set({ items: [] }),

  getItemQty: (id) => {
    const item = get().items.find((x) => x.id === id);
    return item?.quantity ?? 0;
  },

  isInCart: (id) => {
    return get().items.some((x) => x.id === id);
  },

  totalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  totalPrice: () => {
    return get().items.reduce(
      (sum, item) => sum + item.priceNum * item.quantity,
      0
    );
  },
}));