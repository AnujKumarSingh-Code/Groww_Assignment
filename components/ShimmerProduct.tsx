import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ScrollView } from 'react-native';
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/constants/theme";

export const ShimmerChart = () => {
  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);
  const shimmerAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnimatedValue]);

  const opacity = shimmerAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.chartContainer}>
      <Animated.View
        style={[
          styles.chartShimmer,
          {
            backgroundColor: theme.muted,
            opacity,
          },
        ]}
      />
    </View>
  );
};

const ShimmerProduct = () => {
  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);
  const shimmerAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnimatedValue]);

  const opacity = shimmerAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const ShimmerView = ({ style }: { style: any }) => (
    <Animated.View
      style={[
        {
          backgroundColor: theme.muted,
          opacity,
        },
        style,
      ]}
    />
  );

  const ShimmerMetricRow = () => (
    <View style={styles.metricRow}>
      <ShimmerView style={styles.metricLabelShimmer} />
      <ShimmerView style={styles.metricValueShimmer} />
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <ShimmerView style={styles.tickerShimmer} />
          <View style={styles.headerActions}>
            <ShimmerView style={styles.iconShimmer} />
            <ShimmerView style={styles.iconShimmer} />
          </View>
        </View>

        <View style={styles.companyInfo}>
          <ShimmerView style={styles.companyNameShimmer} />
          <ShimmerView style={styles.priceShimmer} />
        </View>

        <ShimmerChart />

        <View style={styles.sectionContainer}>
          <ShimmerView style={styles.sectionTitleShimmer} />
          {Array.from({ length: 6 }).map((_, index) => (
            <ShimmerMetricRow key={index} />
          ))}
        </View>

        <View style={styles.sectionContainer}>
          <ShimmerView style={styles.sectionTitleShimmer} />
          {Array.from({ length: 6 }).map((_, index) => (
            <ShimmerMetricRow key={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ShimmerProduct;

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
  tickerShimmer: {
    height: 36,
    width: 80,
    borderRadius: 6,
  },
  iconShimmer: {
    height: 26,
    width: 26,
    borderRadius: 13,
  },
  companyInfo: {
    marginTop: 8,
  },
  companyNameShimmer: {
    height: 22,
    width: '70%',
    borderRadius: 4,
    marginBottom: 8,
  },
  priceShimmer: {
    height: 36,
    width: '40%',
    borderRadius: 6,
  },
  chartContainer: {
    marginVertical: 24,
  },
  chartShimmer: {
    height: 200,
    width: '100%',
    borderRadius: 12,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 4,
  },
  sectionTitleShimmer: {
    height: 24,
    width: '30%',
    borderRadius: 4,
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
  metricLabelShimmer: {
    height: 16,
    width: '40%',
    borderRadius: 4,
  },
  metricValueShimmer: {
    height: 16,
    width: '25%',
    borderRadius: 4,
  },
});
