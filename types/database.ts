export interface TickerItem {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
}

export interface TopGainersLosersResponse {
  last_updated: string;
  metadata: string;
  top_gainers: TickerItem[];
  top_losers: TickerItem[];
}

export interface StockDetails {
  Symbol: string;
  Name: string;
  Price?: string;
  Description: string;

  // Performance
  "52WeekLow": string;
  "52WeekHigh": string;
  Open?: string | null;
  High?: string | null;
  Low?: string | null;
  PreviousClose?: string | null;

  MarketCapitalization: string;
  PERatio: string | null;
  PriceToBookRatio: string | null;
  ReturnOnEquityTTM: string;
  EPS: string | null;
  DividendYield: string | null;
}
