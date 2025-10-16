import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Stock = {
  symbol: string;
  name: string;
  low: string;
  high: string;
};

type Watchlist = {
  id: string;
  name: string;
  stocks: Stock[];
};

type WatchlistStore = {
  watchlists: Watchlist[];
  stockSet: Set<string>;
  addWatchlist: (name: string) => void;
  removeWatchlist: (id: string) => void;
  addStockToWatchlist: (watchlistId: string, stock: Stock) => void;
  removeStockFromWatchlist: (watchlistId: string, symbol: string) => void;
  isStockBookmarked: (symbol: string) => boolean;
};

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      watchlists: [],
      stockSet: new Set(),
      addWatchlist: (name) =>
        set((state) => ({
          watchlists: [
            ...state.watchlists,
            {
              id: `${name}-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
              name,
              stocks: [],
            },
          ],
        })),

      removeWatchlist: (id) =>
        set((state) => ({
          watchlists: state.watchlists.filter((wl) => wl.id !== id),
        })),

      addStockToWatchlist: (watchlistId, stock) =>
        set((state) => {
          const newWatchlists = state.watchlists.map((wl) =>
            wl.id === watchlistId
              ? wl.stocks.some((s) => s.symbol === stock.symbol)
                ? wl
                : { ...wl, stocks: [...wl.stocks, stock] }
              : wl
          );

          const newSet = new Set(state.stockSet);
          newSet.add(stock.symbol);

          return { watchlists: newWatchlists, stockSet: newSet };
        }),

      removeStockFromWatchlist: (watchlistId, symbol) =>
        set((state) => {
          const newWatchlists = state.watchlists.map((wl) =>
            wl.id === watchlistId
              ? { ...wl, stocks: wl.stocks.filter((s) => s.symbol !== symbol) }
              : wl
          );

          // rebuild set to stay consistent
          const newSet = new Set<string>();
          newWatchlists.forEach((wl) =>
            wl.stocks.forEach((s) => newSet.add(s.symbol))
          );

          return { watchlists: newWatchlists, stockSet: newSet };
        }),

      isStockBookmarked: (symbol) => get().stockSet.has(symbol),
    }),
    {
      name: "watchlist-storage", // storage key
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        ...state,
        stockSet: Array.from(state.stockSet),
      }),
      merge: (persisted, current) => ({
        ...current,
        ...(typeof persisted === "object" && persisted !== null
          ? persisted
          : {}),
        stockSet: new Set((persisted as any).stockSet || []),
      }),
    }
  )
);
