import { LineChart } from "react-native-chart-kit";
import { getTheme } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";
import { StyleSheet, PanResponder, Dimensions, View, Text } from "react-native";
import { useState } from "react";

interface ChartData {
  labels: string[];
  datasets: { data: number[] }[];
}

const ChartComp = ({ chartData }: { chartData: ChartData }) => {
  const [selectedPoint, setSelectedPoint] = useState<{
    value: number;
    index: number;
    x: number;
    y: number;
  } | null>(null);

  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);
  const screenWidth = Dimensions.get("window").width;


  if (!chartData || !chartData.labels || !chartData.datasets) {
    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.instructionText, { color: theme.secondary }]}>
          Loading chart data...
        </Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: theme.background,
    backgroundGradientTo: theme.background,
    color: () => "green",
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 2,
    fillShadowGradient: "transparent",
    fillShadowGradientOpacity: 0,
    propsForLabels: {
      fontSize: 3,
    },
    propsForVerticalLabels: {
      fontSize: 0,
    },
    propsForHorizontalLabels: {
      fontSize: 0,
    },
    propsForDots: {
      r: "0",
      strokeWidth: "0",
    },
  };


  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      const chartWidth = screenWidth;
      const dataPointWidth =
        chartWidth / (chartData.datasets[0].data.length - 1);


      const index = Math.round(locationX / dataPointWidth);

      if (index >= 0 && index < chartData.datasets[0].data.length) {
        setSelectedPoint({
          value: chartData.datasets[0].data[index],
          index: index,
          x: locationX,
          y: locationY,
        });
      }
    },
    onPanResponderEnd: () => {
      setSelectedPoint(null);
    },
  });
  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartWrapper} {...panResponder.panHandlers}>
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withDots={false}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={true}
          withHorizontalLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={false}
          segments={2}
          decorator={() => {
            if (selectedPoint) {
              const timeLabels = chartData.labels
              return (
                <View
                  style={[
                    styles.tooltip,
                    {
                      left: selectedPoint.x - 40,
                      top: selectedPoint.y - 70,
                      backgroundColor: theme.background,
                      borderColor: theme.secondary,
                    },
                  ]}
                >
                  <Text style={[styles.tooltipPrice, { color: theme.text }]}>
                    ${selectedPoint.value.toFixed(2)}
                  </Text>
                  <Text
                    style={[styles.tooltipTime, { color: theme.secondary }]}
                  >
                    {timeLabels[selectedPoint.index]}
                  </Text>
                  <View
                    style={[
                      styles.tooltipArrow,
                      { borderTopColor: theme.background },
                    ]}
                  />
                </View>
              );
            }
            return null;
          }}
        />
      </View>
    </View>
  );
};

export default ChartComp;

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 0,
  },
  priceChangeContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  priceChange: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timeframe: {
    fontSize: 14,
    marginTop: 4,
  },
  chartWrapper: {
    position: "relative",
    paddingHorizontal: 0,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    minWidth: 80,
  },
  tooltipPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  tooltipTime: {
    fontSize: 12,
    marginTop: 2,
  },
  tooltipArrow: {
    position: "absolute",
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderStyle: "solid",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  instructionText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 8,
    fontStyle: "italic",
  },
});
