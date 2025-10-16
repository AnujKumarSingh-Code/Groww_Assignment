import { getTheme } from "@/constants/theme";
import { useDebounce } from "@/hook/useDebounce";
import { alphaApi } from "@/services/alphaApi";
import { useThemeStore } from "@/store/themeStore";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

export interface StockSearchResult {
  "1. symbol": string;
  "2. name": string;
  "3. type": string;
  "4. region": string;
  "5. marketOpen": string;
  "6. marketClose": string;
  "7. timezone": string;
  "8. currency": string;
  "9. matchScore": string;
}

const dummyData = [
  {
    "1. symbol": "BA",
    "2. name": "Boeing Company",
    "3. type": "Equity",
    "4. region": "United States",
    "5. marketOpen": "09:30",
    "6. marketClose": "16:00",
    "7. timezone": "UTC-04",
    "8. currency": "USD",
    "9. matchScore": "1.0000",
  },
  {
    "1. symbol": "BA.LON",
    "2. name": "BAE Systems plc",
    "3. type": "Equity",
    "4. region": "United Kingdom",
    "5. marketOpen": "08:00",
    "6. marketClose": "16:30",
    "7. timezone": "UTC+01",
    "8. currency": "GBX",
    "9. matchScore": "0.6667",
  },
  {
    "1. symbol": "BA05.LON",
    "2. name": "BA05",
    "3. type": "Equity",
    "4. region": "United Kingdom",
    "5. marketOpen": "08:00",
    "6. marketClose": "16:30",
    "7. timezone": "UTC+01",
    "8. currency": "GBP",
    "9. matchScore": "0.6667",
  },
  {
    "1. symbol": "BA29.LON",
    "2. name": "BA29",
    "3. type": "Equity",
    "4. region": "United Kingdom",
    "5. marketOpen": "08:00",
    "6. marketClose": "16:30",
    "7. timezone": "UTC+01",
    "8. currency": "GBP",
    "9. matchScore": "0.6667",
  },
];

const Explore = () => {
  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<StockSearchResult[]>(dummyData);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();


  const searchStocks = async (query: string) => {
    if (!query.trim()) {
      setFilteredResults(dummyData);
      setSearchResults([]);
      setError(null);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const response = await alphaApi.searchSymbol(query);
      
      if (response) {
        const results = response.map((match: any) => ({
          "1. symbol": match["1. symbol"],
          "2. name": match["2. name"],
          "3. type": match["3. type"],
          "4. region": match["4. region"],
          "5. marketOpen": match["5. marketOpen"],
          "6. marketClose": match["6. marketClose"],
          "7. timezone": match["7. timezone"],
          "8. currency": match["8. currency"],
          "9. matchScore": match["9. matchScore"],
        }));
        
        setSearchResults(results);
        setFilteredResults(results);
      } else {
        setSearchResults([]);
        setFilteredResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search stocks. Please try again.');
      setSearchResults([]);
      setFilteredResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useDebounce(searchStocks, 1000);


  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      setFilteredResults(dummyData);
      setSearchResults([]);
      setIsSearching(false);
      setError(null);
    }
  };


  const clearSearch = () => {
    setSearchQuery("");
    setFilteredResults(dummyData);
    setSearchResults([]);
    setIsSearching(false);
    setError(null);
  };

  const renderItem = ({ item }: { item: StockSearchResult }) => {
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.cardBackground }]}
        onPress={() => {
          router.push(`/product/${item['1. symbol']}`)
        }}
      >
        <View style={styles.stockInfo}>
          <View style={styles.stockHeader}>
            <Text style={[styles.symbol, { color: theme.text }]}>
              {item['1. symbol']}
            </Text>
            <Text style={[styles.name, { color: theme.secondary }]}>
              {item['2. name']}
            </Text>
          </View>
          <View style={styles.stockDetails}>
            <Text style={[styles.region, { color: theme.secondary }]}>
              {item['4. region']} • {item['8. currency']}
            </Text>
          </View>
        </View>

        <View style={styles.priceInfo}>
          <Feather name="arrow-right" size={24} color={theme.secondary} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Explore</Text>
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
          onChangeText={handleSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Feather name="x" size={20} color={theme.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <AntDesign name="exclamationcircleo" size={24} color={theme.error || "#ff6b6b"} />
          <Text style={[styles.errorText, { color: theme.error || "#ff6b6b" }]}>
            {error}
          </Text>
        </View>
      )}

      {isSearching && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.secondary }]}>
            Searching stocks...
          </Text>
        </View>
      )}

      {!isSearching && !error && filteredResults.length > 0 && (
        <FlatList
          data={filteredResults}
          renderItem={renderItem}
          keyExtractor={(item) => item["1. symbol"]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {!isSearching && !error && searchQuery.length > 0 && filteredResults.length === 0 && (
        <View style={styles.noResultsContainer}>
          <AntDesign name="frowno" size={48} color={theme.secondary} />
          <Text style={[styles.noResultsText, { color: theme.secondary }]}>
            No stocks found for {searchQuery}
          </Text>
          <Text style={[styles.noResultsSubtext, { color: theme.secondary }]}>
            Try searching with a different keyword
          </Text>
        </View>
      )}
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
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
  loaderContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  listContainer: {
    paddingBottom: 20,
  },
  separator: {
    height: 8,
  },
  stockDetails: {
    marginTop: 4,
    gap: 2,
  },
  region: {
    fontSize: 12,
    opacity: 0.8,
  },
  type: {
    fontSize: 12,
    opacity: 0.6,
  },
  noResultsContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    gap: 12,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  noResultsSubtext: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    flex: 1,
  },
});
