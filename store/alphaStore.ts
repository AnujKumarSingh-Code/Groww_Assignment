import { storage } from "@/lib/storage";
import { alphaApi } from "@/services/alphaApi";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// TTL configs (ms)
const TTL = {
  gainersLosers: 15 * 60 * 1000,
  fundamentals: 24 * 60 * 60 * 1000,
};

type CacheEntry<T> = {
  data: T;
  timestamp: number;
}

type AlphaState = {
  gainersLosers?: CacheEntry<any>;
  companyFundamentals: Record<string, CacheEntry<any>>;
  tickerSearchCache: Record<string, CacheEntry<any>>;

  loading: boolean;
  error: string | null;

  fetchGainersLosers: () => Promise<any>;
  fetchCompanyFundamentals: (symbol: string) => Promise<any>;
};

export const useAlphaStore = create<AlphaState>()(
  persist(
    (set, get) => ({
      gainersLosers: undefined,
      companyFundamentals: {},
      tickerSearchCache: {},

      loading: false,
      error: null,

      // Top Gainers & Losers
      fetchGainersLosers: async () => {
        const cached = get().gainersLosers;
        if (cached && Date.now() - cached.timestamp < TTL.gainersLosers) {
          return cached.data; // ✅ return cache
        }

        set({ loading: true, error: null });
        try {
          const data = await alphaApi.getGainersLosers();
          set({
            gainersLosers: { data, timestamp: Date.now() },
            loading: false,
          });
          return data;
        } catch (err: any) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      // Fundamentals
      fetchCompanyFundamentals: async (symbol: string) => {
        const cached = get().companyFundamentals[symbol];
        if (cached && Date.now() - cached.timestamp < TTL.fundamentals) {
          return cached.data;
        }

        set({ loading: true, error: null });
        try {
          const data = await alphaApi.getCompanyOverview(symbol);
          set((state) => ({
            companyFundamentals: {
              ...state.companyFundamentals,
              [symbol]: { data, timestamp: Date.now() },
            },
            loading: false,
          }));
          return data;
        } catch (err: any) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },
    }),
    {
      name: "alpha-cache",
      storage: createJSONStorage(() => storage),
    }
  )
);
