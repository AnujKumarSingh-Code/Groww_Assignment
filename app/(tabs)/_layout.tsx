import { Tabs, useRouter } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Animated,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/constants/theme";
import ThemeToggle from "@/components/ThemeToggle";
import { useState, useEffect, useRef } from "react";

const RootLayout = () => {
  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);
  const [showPopup, setShowPopup] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const router = useRouter();

  const STATUS_DURATION = 5000;

  useEffect(() => {
    if (showPopup) {
      progressAnim.setValue(0);
      fadeAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      Animated.timing(progressAnim, {
        toValue: 1,
        duration: STATUS_DURATION,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          handleCloseStatus();
        }
      });
    }
  }, [showPopup]);

  const handleCloseStatus = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowPopup(false);
      progressAnim.setValue(0);
    });
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const PopupContent = () => (
    <Modal
      visible={showPopup}
      transparent={true}
      animationType="none"
      onRequestClose={handleCloseStatus}
    >
      <Animated.View style={[styles.statusOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.statusContainer}
          activeOpacity={1}
          onPress={handleCloseStatus}
        >

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarBackground,
                { backgroundColor: theme.muted + "40" },
              ]}
            >
              <Animated.View
                style={[
                  styles.progressBar,
                  { backgroundColor: theme.primary, width: progressWidth },
                ]}
              />
            </View>
          </View>

          <View style={styles.statusContent}>
            <View style={styles.profileSection}>
              <View
                style={[
                  styles.statusImageContainer,
                  { borderColor: theme.primary },
                ]}
              >
                <Image
                  source={require("@/assets/logo.png")}
                  style={styles.statusImage}
                />
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: "white" }]}>
                  Anuj Kumar
                </Text>
                <Text
                  style={[styles.timestamp, { color: "rgba(255,255,255,0.8)" }]}
                >
                  Just now
                </Text>
              </View>
            </View>


            <View style={styles.statusMessage}>
              <Text style={[styles.greeting, { color: "white" }]}>
                Hey there! 👋
              </Text>
              <Text style={[styles.greeting, { color: "white" }]}>
                I am Anuj Kumar
              </Text>
              <Text
                style={[styles.subtitle, { color: "rgba(255,255,255,0.9)" }]}
              >
                From Army Institute of Technology, Pune
              </Text>
              <Text style={[styles.madeWith, { color: theme.primary }]}>
                ❤️ Made with love
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        headerTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          elevation: 8,
          shadowColor: theme.shadowColor,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        headerLeft: () => {
          return (
            <View
              style={{
                marginLeft: 24,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity onPress={() => setShowPopup(true)}>
                <View
                  style={[
                    styles.imageContainer,
                    { borderColor: theme.primary },
                  ]}
                >
                  <Image
                    source={require("@/assets/logo.png")}
                    alt="alt"
                    style={styles.logoImage}
                  />
                </View>
              </TouchableOpacity>
              <PopupContent />
            </View>
          );
        },
        headerRight: () => {
          return (
            <View
              style={{
                marginRight: 24,
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
              }}
            >
              <ThemeToggle />
              <TouchableOpacity onPress={() => router.push("/explore/explore")}>
                <AntDesign name="search1" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
          );
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          marginLeft: 16,
          fontWeight: "700",
          fontSize: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Stocks",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="line-graph" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="watchList"
        options={{
          title: "Watchlist",
          tabBarIcon: ({ color, size }) => (
            <Feather name="bookmark" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  statusOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  statusContainer: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 3,
    borderRadius: 1.5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 1.5,
  },
  statusContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  statusImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 14,
    marginTop: 2,
  },
  statusMessage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  madeWith: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default RootLayout;
