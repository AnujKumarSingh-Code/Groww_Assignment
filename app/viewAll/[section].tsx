import { View, Text, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import StockCard from "@/components/StockCard";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/constants/theme";
import { useAlphaStore } from "@/store/alphaStore";
import { TickerItem } from "@/types/database";
import ShimmerStockCard from "@/components/Shimmer";

const ViewAll = () => {
  const { section } = useLocalSearchParams();
  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);
  const { loading, fetchGainersLosers } = useAlphaStore();

  const [allData, setAllData] = useState<TickerItem[]>([]);
  const [visibleData, setVisibleData] = useState<TickerItem[]>([]);
  const [page, setPage] = useState(1);

  const pageSize = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGainersLosers();
        if (response) {
          const rawData =
            section === "gainers"
              ? response.top_gainers || []
              : response.top_losers || [];
          setAllData(rawData);

          setVisibleData(rawData.slice(0, pageSize));
        }
      } catch (error) {
        console.error("Failed to fetch gainers/losers:", error);
      }
    };

    fetchData();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    const newSlice = allData.slice(0, nextPage * pageSize);

    if (newSlice.length > visibleData.length) {
      setVisibleData(newSlice);
      setPage(nextPage);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: theme.primary,
          paddingBottom: 16,
        }}
      >
        {section === "gainers" ? "Top Gainers" : "Top Losers"}
      </Text>

      {loading ? (
        <View style={styles.ShimmerCardContainer}>
          {Array.from({ length: 10 }).map((_, index) => (
            <ShimmerStockCard key={index} />
          ))}
        </View>
      ) : (
        <FlatList
          data={visibleData}
          keyExtractor={(item) => item.ticker}
          renderItem={({ item }) => <StockCard stock={item} />}
          contentContainerStyle={styles.cardContainer}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.row}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            visibleData.length < allData.length ? (
              <Text
                style={{
                  textAlign: "center",
                  padding: 12,
                  color: theme.secondary,
                }}
              >
                Loading more...
              </Text>
            ) : null
          }
        />
      )}
    </View>
  );
};


export default ViewAll;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    paddingBottom: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ShimmerCardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 16,
  },
});
