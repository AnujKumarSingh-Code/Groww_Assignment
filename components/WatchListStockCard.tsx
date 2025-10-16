import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/constants/theme";
import { useRouter } from "expo-router";

type Stock = {
  symbol: string;
  name: string;
  low: string;
  high: string;
};

const WatchListStockCard = ({ stock }: { stock: Stock }) => {
  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);

  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.cardBackground }]}
      onPress={() => router.push(`/product/${stock.symbol}`)}
    >
      <View style={styles.stockInfo}>
        <View style={styles.stockHeader}>
          <Text style={[styles.symbol, { color: theme.text }]}>
            {stock.symbol}
          </Text>
          <Text style={[styles.name, { color: theme.secondary }]}>
            {stock.name}
          </Text>
        </View>
      </View>

      <View style={styles.priceInfo}>
        <Text style={[styles.price, { color: theme.text }]}>${stock.high}</Text>
        <Text style={[styles.change, { color: "#ef4444" }]}>${stock.low}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  stockInfo: {
    flex: 1,
  },
  stockHeader: {
    gap: 4,
  },
  symbol: {
    fontSize: 18,
    fontWeight: "bold",
  },
  name: {
    fontSize: 14,
    opacity: 0.7,
  },
  priceInfo: {
    alignItems: "flex-end",
    gap: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  change: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default WatchListStockCard;
