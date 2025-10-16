import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  type?: 'dots' | 'spinner';
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'medium', 
  type = 'dots' 
}) => {
  const animatedValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  const sizeConfig = {
    small: { container: 40, element: 8 },
    medium: { container: 60, element: 12 },
    large: { container: 80, element: 16 }
  };

  const config = sizeConfig[size];

  const primaryColor = '#007AFF';
  const secondaryColor = '#007AFF40'; 
  const tertiaryColor = '#007AFF20';
  const quaternaryColor = '#007AFF10'; 
  useEffect(() => {
    const createAnimation = () => {
      if (type === 'dots') {
        return Animated.loop(
          Animated.stagger(200, 
            animatedValues.map(animValue =>
              Animated.sequence([
                Animated.timing(animValue, {
                  toValue: 1,
                  duration: 600,
                  easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
                  useNativeDriver: true,
                }),
                Animated.timing(animValue, {
                  toValue: 0,
                  duration: 600,
                  easing: Easing.bezier(0.68, -0.55, 0.265, 1.55),
                  useNativeDriver: true,
                }),
              ])
            )
          )
        );
      } else if (type === 'spinner') {
        return Animated.loop(
          Animated.timing(animatedValues[0], {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        );
      }
    };

    const animation = createAnimation();
    animation?.start();

    return () => animation?.stop();
  }, [type]);

  const renderDots = () => (
    <View style={[styles.container, { width: config.container * 2, height: config.container }]}>
      {animatedValues.map((animValue, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              width: config.element,
              height: config.element,
              backgroundColor: primaryColor,
              transform: [
                {
                  scale: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 1.2],
                  }),
                },
                {
                  translateY: animValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -config.element],
                  }),
                },
              ],
              opacity: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 1],
              }),
            },
          ]}
        />
      ))}
    </View>
  );



  const renderSpinner = () => (
    <View style={[styles.container, { width: config.container, height: config.container }]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: config.container,
            height: config.container,
            borderWidth: config.element * 0.25,
            borderTopColor: primaryColor,
            borderRightColor: secondaryColor,
            borderBottomColor: tertiaryColor,
            borderLeftColor: quaternaryColor,
            transform: [
              {
                rotate: animatedValues[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'spinner':
        return renderSpinner();
      default:
        return renderDots();
    }
  };

  return <View style={styles.wrapper}>{renderLoader()}</View>;
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    borderRadius: 50,
    marginHorizontal: 4,
  },
  pulseOuter: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 2,
  },
  pulseInner: {
    borderRadius: 50,
  },
  barsContainer: {
    alignItems: 'flex-end',
    height: 40,
  },
  bar: {
    marginHorizontal: 2,
    borderRadius: 2,
  },
  spinner: {
    borderRadius: 50,
  },
});

export default Loading;
