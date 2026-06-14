import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  artworkId: string;
  slug: string;
  title: string;
  image: string;
  priceNpr: number;
  artistName: string;
  addedAt: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (artworkId: string) => void;
  clearCart: () => void;
  totalNpr: () => number;
  itemCount: () => number;
  isInCart: (artworkId: string) => boolean;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (get().items.some((i) => i.artworkId === item.artworkId)) return;
        set((state) => ({ items: [...state.items, item] }));
      },
      removeItem: (artworkId) => {
        set((state) => ({ items: state.items.filter((i) => i.artworkId !== artworkId) }));
      },
      clearCart: () => set({ items: [] }),
      totalNpr: () => get().items.reduce((sum, i) => sum + i.priceNpr, 0),
      itemCount: () => get().items.length,
      isInCart: (artworkId) => get().items.some((i) => i.artworkId === artworkId),
    }),
    { name: "thangkahub-cart" }
  )
);
