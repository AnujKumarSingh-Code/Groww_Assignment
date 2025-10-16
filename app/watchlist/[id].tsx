import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/constants/theme";
import WatchListStockCard from "@/components/WatchListStockCard";
import { useWatchlistStore } from "@/store/watchlistStore";

interface Stock {
  symbol: string;
  name: string;
  low: string;
  high: string;
}

const WatchListDetails = () => {
  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);
  const [searchQuery, setSearchQuery] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { id } = useLocalSearchParams<{ id: string }>();
  const { watchlists, removeStockFromWatchlist } = useWatchlistStore();

  useEffect(() => {
    const watchlist = watchlists.find((wl) => wl.id === id);
    if (watchlist) {
      setStocks(watchlist.stocks || []);
    }
  }, [id, watchlists]);

  const watchlist = watchlists.find((wl) => wl.id === id);

  const filteredStocks = stocks.filter((stock) =>
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteToggle = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedItems([]);
  };

  const handleItemSelect = (symbol: string) => {
    if (selectedItems.includes(symbol)) {
      setSelectedItems(selectedItems.filter((item) => item !== symbol));
    } else {
      setSelectedItems([...selectedItems, symbol]);
    }
  };

  const handleDelete = () => {
    selectedItems.forEach((symbol) => {
      if (removeStockFromWatchlist) {
        removeStockFromWatchlist(id!, symbol);
      }
    });
    setSelectedItems([]);
    setIsDeleteMode(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          {watchlist?.name || "Watchlist"}
        </Text>
        {stocks.length > 0 && (
          <TouchableOpacity onPress={handleDeleteToggle}>
            <Feather
              name={isDeleteMode ? "x" : "trash-2"}
              size={24}
              color={isDeleteMode ? "#ef4444" : theme.text}
            />
          </TouchableOpacity>
        )}
      </View>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.cardBackground },
        ]}
      >
        <Feather name="search" size={20} color={theme.secondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search stocks..."
          placeholderTextColor={theme.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.stockList} showsVerticalScrollIndicator={false}>
        {filteredStocks.map((stock, index) => {
          const isSelected = selectedItems.includes(stock.symbol);
          return (
            <TouchableOpacity
              key={index}
              style={styles.stockCard}
              onPress={() => {
                if (isDeleteMode) {
                  handleItemSelect(stock.symbol);
                }
              }}
            >
              {isDeleteMode && (
                <View style={styles.checkbox}>
                  <View
                    style={[
                      styles.checkboxInner,
                      {
                        backgroundColor: isSelected ? "#22c55e" : "transparent",
                        borderColor: isSelected ? "#22c55e" : theme.secondary,
                      },
                    ]}
                  >
                    {isSelected && (
                      <Feather name="check" size={16} color="white" />
                    )}
                  </View>
                </View>
              )}

              <View
                style={[
                  styles.stockCardContent,
                  { marginLeft: isDeleteMode ? 12 : 0 },
                ]}
              >
                <WatchListStockCard stock={stock} />
              </View>
            </TouchableOpacity>
          );
        })}

        {filteredStocks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.secondary }]}>
              {searchQuery ? "No stocks found" : "No stocks in this watchlist"}
            </Text>
          </View>
        )}
      </ScrollView>

      {isDeleteMode && selectedItems.length > 0 && (
        <View
          style={[
            styles.deleteButtonContainer,
            { backgroundColor: theme.background },
          ]}
        >
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Feather name="trash-2" size={20} color="white" />
            <Text style={styles.deleteButtonText}>
              Delete {selectedItems.length} item
              {selectedItems.length > 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default WatchListDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  stockList: {
    flex: 1,
    paddingBottom: 20,
  },
  stockCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderRadius: 12,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  stockCardContent: {
    flex: 1,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
  },
  deleteButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 34,
  },
  deleteButton: {
    backgroundColor: "#ef4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
