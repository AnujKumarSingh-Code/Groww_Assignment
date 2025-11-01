import axios from "axios";
import { API_KEY, BASE_URL } from "@env";


const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 8000, 
});

export const alphaApi = {

  async getGainersLosers() {
    try {
      const res = await apiClient.get("", {
        params: { function: "TOP_GAINERS_LOSERS", apikey: API_KEY },
      });

      if (!res.data || Object.keys(res.data).length === 0) {
        throw new Error(
          "Empty response from AlphaVantage (TOP_GAINERS_LOSERS)."
        );
      }

      if (res.data.Note) {
        throw new Error(res.data.Note);
      }

      return res.data;
    } catch (err: any) {
      console.error("Error fetching Gainers/Losers:", err.message || err);
      return null;
    }
  },


  async getCompanyOverview(symbol: string) {
    try {
      const res = await apiClient.get("", {
        params: { function: "OVERVIEW", symbol, apikey: API_KEY },
      });

      if (!res.data || Object.keys(res.data).length === 0) {
        throw new Error(`No data found for symbol: ${symbol}`);
      }

      if (res.data.Note) {
        throw new Error(res.data.Note);
      }

      if(res.data?.Information){
        return null;
      }

      return res.data;
    } catch (err: any) {
      console.error(
        `Error fetching company overview (${symbol}):`,
        err.message || err
      );
      return null;
    }
  },

  async getIntraday(
    symbol: string,
    interval: "1min" | "5min" | "15min" | "30min" | "60min" = "5min"
  ) {
    try {
      const res = await apiClient.get("", {
        params: {
          function: "TIME_SERIES_INTRADAY",
          symbol,
          interval,
          apikey: API_KEY,
        },
      });

      if (!res.data || Object.keys(res.data).length === 0) {
        throw new Error(`No intraday data found for symbol: ${symbol}`);
      }

      if (res.data.Note) {
        throw new Error(res.data.Note);
      }

      return res.data;
    } catch (err: any) {
      console.error(
        `Error fetching intraday data (${symbol}):`,
        err.message || err
      );
      return null;
    }
  },

  async searchSymbol(keywords: string) {
    try {
      const res = await apiClient.get("", {
        params: {
          function: "SYMBOL_SEARCH",
          keywords,
          apikey: API_KEY
        },
      });

      if (!res.data || Object.keys(res.data).length === 0) {
        throw new Error(`No search results found for: ${keywords}`);
      }

      if (res.data.Note) {
        throw new Error(res.data.Note);
      }

      return res.data.bestMatches || [];
    } catch (err: any) {
      console.error(
        `Error searching symbol (${keywords}):`,
        err.message || err
      );
      return [];
    }
  },
};
