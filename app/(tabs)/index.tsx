import StockCard from "@/components/StockCard";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/constants/theme";
import { useRouter } from "expo-router";
import ShimmerStockCard, { ShimmerSectionHeader } from "@/components/Shimmer";
import { useAlphaStore } from "@/store/alphaStore";
import { TopGainersLosersResponse, TickerItem } from "@/types/database";

const StockSection = ({
  title,
  data,
  theme,
  viewAllLink,
  limit = 4,
}: {
  title: string;
  data?: TickerItem[];
  theme: any;
  viewAllLink: string;
  limit?: number;
}) => {
  const router = useRouter();
  return (
    <View>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={[styles.selectionText, { color: theme.text }]}>
            {title}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            if(data?.length === 0){
              alert("No data available. You may have reached the API rate limit of 25 requests/day.");
            }else{
              router.push(viewAllLink as `/viewAll/${string}`)
            }
          }}
        >
          <Text style={[styles.viewAllText, { color: theme.primary }]}>
            View All
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stockList}>
        {data && data.length > 0 ? (
          data
            .slice(0, limit)
            .map((item) => <StockCard key={item.ticker} stock={item} />)
        ) : (
          <EmptyState
            message="Data unavailable. You may have reached the API rate limit of 25 requests/day."
            theme={theme}
          />
        )}
      </View>
    </View>
  );
};

const EmptyState = ({ message, theme }: { message: string; theme: any }) => (
  <View style={{ alignItems: "center", marginTop: 50 }}>
    <Text
      style={{
        color: theme.secondary,
        fontSize: 16,
        textAlign: "center",
      }}
    >
      {message}
    </Text>
  </View>
);

const Shimmer = () => {
  return (
    <View>
      <ShimmerSectionHeader />
      <View style={styles.stockList}>
        {Array.from({ length: 4 }).map((_, index) => (
          <ShimmerStockCard key={index} />
        ))}
      </View>
    </View>
  );
};

const Home = () => {
  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);
  const { loading, fetchGainersLosers } = useAlphaStore();
  const [topGL, setTopGL] = useState<TopGainersLosersResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchGainersLosers();
        if (data) setTopGL(data);
      } catch (error) {
        console.error("Failed to fetch gainers/losers:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {loading ? (
        <View>
          <Shimmer />
          <Shimmer />
        </View>
      ) : (
        <View>
          <StockSection
            title="Top Gainers"
            data={topGL?.top_gainers || []}
            theme={theme}
            viewAllLink="/viewAll/gainers"
          />

          <StockSection
            title="Top Losers"
            data={topGL?.top_losers || []}
            theme={theme}
            viewAllLink="/viewAll/losers"
          />
        </View>
      )}
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 0,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  selectionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,
  },
  selectionText: {
    fontSize: 24,
    fontWeight: "600",
  },
  viewAllText: {
    fontWeight: "600",
    fontSize: 14,
  },
  stockList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 38,
  },
});
