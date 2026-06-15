import { create } from "zustand";
import { persist } from "zustand/middleware";
import { syncCartToDb, getCartFromDb } from "@/lib/cart-actions";

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
  syncWithServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        if (get().items.some((i) => i.artworkId === item.artworkId)) return;
        set((state) => ({ items: [...state.items, item] }));
        get().syncWithServer();
      },
      removeItem: (artworkId) => {
        set((state) => ({ items: state.items.filter((i) => i.artworkId !== artworkId) }));
        get().syncWithServer();
      },
      clearCart: () => {
        set({ items: [] });
        get().syncWithServer();
      },
      totalNpr: () => get().items.reduce((sum, i) => sum + i.priceNpr, 0),
      itemCount: () => get().items.length,
      isInCart: (artworkId) => get().items.some((i) => i.artworkId === artworkId),
      syncWithServer: async () => {
        const { items } = get();
        await syncCartToDb(items.map(i => ({ artworkId: i.artworkId })));
      },
      loadFromServer: async () => {
        const serverItems = await getCartFromDb();
        if (serverItems.length > 0) {
          set({
            items: serverItems.map(item => ({
              artworkId: item.artworkId,
              slug: item.slug,
              title: item.title,
              image: item.images?.[0] ?? "",
              priceNpr: item.priceNpr,
              artistName: item.artistName ?? "",
              addedAt: Date.now(),
            }))
          });
        }
      },
    }),
    { name: "thangkahub-cart" }
  )
);
