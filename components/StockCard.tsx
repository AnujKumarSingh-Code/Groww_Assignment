import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/constants/theme";
import { useRouter } from "expo-router";
import { TickerItem } from "@/types/database";

const StockCard = ({ stock }: { stock: TickerItem }) => {
  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);

  const changeAmount = parseFloat(stock?.change_amount || "0").toFixed(2);
  const changePercentage = parseFloat(stock?.change_percentage || "0").toFixed(
    2
  );

  const isPositive = !stock.change_amount.startsWith("-");
  const router = useRouter();

  const colors = [
    "#00C49F",
    "#4A90E2",
    "#8E44AD",
    "#F39C12",
    "#00B386",
    "#3F51B5",
    "#E74C3C",
  ];

  const getColorForTicker = (ticker: string) => {
    const index = ticker.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <TouchableOpacity
      style={[
        styles.stockCard,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
        },
      ]}
      onPress={() => router.push(`/product/${stock.ticker}`)}
      activeOpacity={0.8}
    >
      <View style={styles.stockInfo}>
        <View
          style={[
            styles.logoNameContainer,
            { backgroundColor: getColorForTicker(stock.ticker) },
          ]}
        >
          <Text style={[{ color: "white", fontSize: 20, fontWeight: "bold" }]}>
            {stock?.ticker[0].toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.stockSymbol, { color: theme.text }]}>
          {stock?.ticker}
        </Text>
      </View>
      <View style={styles.stockPriceInfo}>
        <Text style={[styles.stockPrice, { color: theme.text }]}>
          ₹{stock?.price}
        </Text>
        <View style={styles.changeContainer}>
          <Text
            style={[
              styles.stockChange,
              { color: isPositive ? theme.success : theme.error },
            ]}
          >
            {changeAmount} ({changePercentage}%)
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default StockCard;

const styles = StyleSheet.create({
  stockCard: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    width: "48%",
    flexDirection: "column",
    gap: 20,
  },
  stockInfo: {
    gap: 10,
  },
  logoNameContainer: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  stockSymbol: {
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  stockName: {
    fontSize: 12,
    fontWeight: "400",
  },
  stockPriceInfo: {
    alignItems: "flex-start",
    gap: 8,
  },
  stockPrice: {
    fontWeight: "600",
    fontSize: 18,
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stockChange: {
    fontSize: 12,
    fontWeight: "600",
  },
});
