import AddStockToWatchList from "@/components/AddStockToWatchList";
import ChartComp from "@/components/ChartComp";
import ShimmerProduct, { ShimmerChart } from "@/components/ShimmerProduct";
import { getTheme } from "@/constants/theme";
import { generateStockData } from "@/utils/dummy";
import { alphaApi } from "@/services/alphaApi";
import { useAlphaStore } from "@/store/alphaStore";
import { useThemeStore } from "@/store/themeStore";
import { useWatchlistStore } from "@/store/watchlistStore";
import { StockDetails } from "@/types/database";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type AlphaVantageData = {
  [timestamp: string]: {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
  };
};

const Product = () => {
  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const { isStockBookmarked } = useWatchlistStore();
  const { loading: fundamentalsLoading, fetchCompanyFundamentals } = useAlphaStore();

  const [stockDetails, setStockDetails] = useState<StockDetails | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [loadingChart, setLoadingChart] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isBookmarked = isStockBookmarked(symbol);

  const mapToChartData = (timeSeries: AlphaVantageData) => {
    const entries = Object.entries(timeSeries).sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    );

    const labels: string[] = [];
    const data: number[] = [];

    entries.forEach(([time, values], i) => {
      data.push(parseFloat(values["4. close"]));
      labels.push(i % 5 === 0 ? time.split(" ")[1].slice(0, 5) : "");
    });

    return {
      labels,
      datasets: [
        {
          data,
          strokeWidth: 3,
          color: (opacity = 1) => `rgba(0, 153, 0, ${opacity})`,
        },
      ],
    };
  };

  const fetchData = async () => {
    setError(null);
    try {
      const data = await fetchCompanyFundamentals(symbol);
      if (data && data.Symbol) {
        setStockDetails(data);
      } else {
        setError("Company information not available");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load company information");
    }
  };

  const fetchChart = async () => {
    setLoadingChart(true);
    try {
      const timeSeriesData = await alphaApi.getIntraday(symbol);
      if (timeSeriesData?.["Time Series (5min)"]) {
        setChartData(mapToChartData(timeSeriesData["Time Series (5min)"]));
      } else {
        setChartData(null);
      }
    } catch (err) {
      console.error(err);
      setChartData(null);
    } finally {
      setLoadingChart(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchChart();
  }, [symbol]);


  const MetricRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.metricRow}>
      <Text style={[styles.metricLabel, { color: theme.onSurface }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: theme.text }]}>{value}</Text>
    </View>
  );

 
  const stock = {
    symbol: stockDetails?.Symbol ?? symbol ?? "",
    name: stockDetails?.Name ?? "Unknown Company",
    low: stockDetails?.["52WeekLow"] ?? "",
    high: stockDetails?.["52WeekHigh"] ?? "",
  };


  const HeaderActions = () => (
    <View style={styles.headerActions}>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        {isBookmarked ? (
          <FontAwesome name="bookmark" size={26} color={theme.text} />
        ) : (
          <Feather name="bookmark" size={26} color={theme.text} />
        )}
      </TouchableOpacity>
    </View>
  );


  const sampleStockData = {
    labels: Array.from({ length: 25 }, (_, i) => `0${6 + Math.floor(i / 5)}:${i % 5 * 5}`),
    datasets: [
      {
        data: generateStockData(24, 35.2),
        strokeWidth: 3,
        color: (opacity = 1) => `rgba(3, 197, 1, ${opacity})`,
      },
    ],
  };


  if (fundamentalsLoading) return <ShimmerProduct />;

  if (error || !stockDetails) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={[styles.tickerSymbol, { color: theme.text }]}>{symbol}</Text>
            <HeaderActions />
          </View>

          <View style={styles.errorContainer}>
            <AntDesign name="exclamationcircleo" size={48} color={theme.secondary} />
            <Text style={[styles.errorTitle, { color: theme.text }]}>Company Information Not Available</Text>
            <Text style={[styles.errorSubtitle, { color: theme.secondary }]}>{error}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.headerContainer}>
          <Text style={[styles.tickerSymbol, { color: theme.text }]}>{stockDetails?.Symbol}</Text>
          <HeaderActions />
        </View>


        <View style={styles.companyInfo}>
          <Text style={[styles.companyName, { color: theme.text }]}>{stockDetails?.Name}</Text>
          <Text style={[styles.metricText, { color: theme.secondary }]}>{stockDetails?.Price ?? "--"}</Text>
        </View>


        {loadingChart ? (
          <ShimmerChart />
        ) : chartData ? (
          <ChartComp chartData={chartData} />
        ) : (
          <View style={styles.sectionContainer}>
            <ChartComp chartData={sampleStockData} />
            <Text style={[styles.sectionTitle, { color: theme.secondary }]}>
              You may have reached the free limit of 25 requests/day. Showing sample data.
            </Text>
          </View>
        )}

        <View>
            <Text style={[{ color: theme.text, textAlign: "justify" }]}>{stockDetails.Description}</Text>
        </View>


        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Performance</Text>
          <MetricRow label="52 Week Low" value={stockDetails["52WeekLow"] ?? "--"} />
          <MetricRow label="52 Week High" value={stockDetails["52WeekHigh"] ?? "--"} />
          <MetricRow label="Today's Open" value={stockDetails?.Open ?? "--"} />
          <MetricRow label="Today's High" value={stockDetails?.High ?? "--"} />
          <MetricRow label="Today's Low" value={stockDetails?.Low ?? "--"} />
          <MetricRow label="Prev Close" value={stockDetails?.PreviousClose ?? "--"} />
        </View>


        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Fundamentals</Text>
          <MetricRow label="Market Cap" value={stockDetails.MarketCapitalization ?? "--"} />
          <MetricRow label="P/E Ratio (TTM)" value={stockDetails?.PERatio ?? "--"} />
          <MetricRow label="P/B Ratio" value={stockDetails?.PriceToBookRatio ?? "--"} />
          <MetricRow label="ROE" value={stockDetails?.ReturnOnEquityTTM ?? "--"} />
          <MetricRow label="EPS (TTM)" value={stockDetails?.EPS ?? "--"} />
          <MetricRow label="Dividend Yield" value={stockDetails?.DividendYield ?? "--"} />
        </View>
      </ScrollView>


      <AddStockToWatchList theme={theme} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} stock={stock} />
    </View>
  );
};


export default Product;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  tickerSymbol: {
    fontSize: 30,
    fontWeight: "bold",
  },
  companyInfo: {
    marginTop: 8,
  },
  companyName: {
    fontSize: 18,
    marginBottom: 4,
  },
  metricText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  metricLabel: {
    fontSize: 16,
    flex: 1,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "right",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    marginTop: 50,
    gap: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
