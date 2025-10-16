export const topGL = {
  topGainers: [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: "195.67",
      change: "+3.45",
      percent_change: "+1.80%",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: "245.32",
      change: "+12.15",
      percent_change: "+5.21%",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp",
      price: "460.50",
      change: "+15.20",
      percent_change: "+3.42%",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: "320.15",
      change: "+5.40",
      percent_change: "+1.72%",
    },
    {
      symbol: "NFLX",
      name: "Netflix Inc.",
      price: "440.60",
      change: "+8.10",
      percent_change: "+1.87%",
    },
    {
      symbol: "AMD",
      name: "Advanced Micro Devices",
      price: "118.90",
      change: "+4.25",
      percent_change: "+3.71%",
    },
    {
      symbol: "SHOP",
      name: "Shopify Inc.",
      price: "75.30",
      change: "+2.80",
      percent_change: "+3.86%",
    },
    {
      symbol: "BABA",
      name: "Alibaba Group",
      price: "92.15",
      change: "+3.95",
      percent_change: "+4.48%",
    },
    {
      symbol: "BA",
      name: "Boeing Co.",
      price: "215.22",
      change: "+6.00",
      percent_change: "+2.87%",
    },
    {
      symbol: "PYPL",
      name: "PayPal Holdings",
      price: "78.10",
      change: "+2.55",
      percent_change: "+3.37%",
    },
  ],
  topLosers: [
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: "132.11",
      change: "-4.65",
      percent_change: "-3.40%",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: "120.44",
      change: "-2.15",
      percent_change: "-1.75%",
    },
    {
      symbol: "META",
      name: "Meta Platforms Inc.",
      price: "310.23",
      change: "-6.80",
      percent_change: "-2.14%",
    },
    {
      symbol: "DIS",
      name: "Walt Disney Co.",
      price: "87.32",
      change: "-3.25",
      percent_change: "-3.59%",
    },
    {
      symbol: "INTC",
      name: "Intel Corp.",
      price: "34.21",
      change: "-1.45",
      percent_change: "-4.06%",
    },
    {
      symbol: "UBER",
      name: "Uber Technologies",
      price: "45.10",
      change: "-2.60",
      percent_change: "-5.45%",
    },
    {
      symbol: "SNAP",
      name: "Snap Inc.",
      price: "10.25",
      change: "-0.75",
      percent_change: "-6.81%",
    },
    {
      symbol: "COIN",
      name: "Coinbase Global",
      price: "72.88",
      change: "-5.50",
      percent_change: "-7.02%",
    },
    {
      symbol: "LYFT",
      name: "Lyft Inc.",
      price: "9.85",
      change: "-0.65",
      percent_change: "-6.19%",
    },
    {
      symbol: "ROKU",
      name: "Roku Inc.",
      price: "58.12",
      change: "-4.80",
      percent_change: "-7.63%",
    },
  ],
};


export const generateStockData = (length: number, basePrice = 35.0) => {
  const data: number[] = [];
  let price = basePrice;

  for (let i = 0; i < length; i++) {
    const change = (Math.random() - 0.5) * 0.8;
    price = Math.max(30, Math.min(40, price + change));
    data.push(parseFloat(price.toFixed(2)));
  }

  return data;
};

