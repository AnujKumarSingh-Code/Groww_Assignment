import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/constants/theme";

export const ShimmerSectionHeader = () => {
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

  return (
    <View style={styles.section}>
      <ShimmerView style={styles.titleShimmer} />
      <ShimmerView style={styles.viewAllShimmer} />
    </View>
  );
};

const ShimmerStockCard = () => {
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

  return (
    <View
      style={[
        styles.stockCard,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.stockInfo}>
        <ShimmerView style={styles.symbolShimmer} />
        <ShimmerView style={styles.nameShimmer} />
      </View>
      
      <View style={styles.stockPriceInfo}>
        <ShimmerView style={styles.priceShimmer} />
        <ShimmerView style={styles.changeShimmer} />
      </View>
    </View>
  );
};

export default ShimmerStockCard;

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
    gap: 4,
  },
  stockPriceInfo: {
    alignItems: "flex-start",
    gap: 8,
  },
  symbolShimmer: {
    height: 20,
    width: '70%',
    borderRadius: 4,
  },
  nameShimmer: {
    height: 14,
    width: '90%',
    borderRadius: 4,
  },
  priceShimmer: {
    height: 22,
    width: '60%',
    borderRadius: 4,
  },
  changeShimmer: {
    height: 16,
    width: '50%',
    borderRadius: 6,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  titleShimmer: {
    height: 20,
    width: 120,
    borderRadius: 6,
  },
  viewAllShimmer: {
    height: 16,
    width: 60,
    borderRadius: 6,
  },
});
