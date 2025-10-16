import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useThemeStore } from "@/store/themeStore";
import { getTheme } from "@/constants/theme";

export default function RootLayout() {
  const { isDarkMode } = useThemeStore();
  const theme = getTheme(isDarkMode);

  return (
    <SafeAreaProvider>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="product/[symbol]"
          options={({ route }: any) => {
            const symbol = route.params?.symbol;
            return {
              headerShown: true,
              headerTitle: symbol ? symbol.toUpperCase() : "Stock Details",
              headerStyle: { backgroundColor: theme.background },
              headerTitleStyle: { color: theme.text },
              headerTintColor: theme.text,
              headerShadowVisible: false,
            };
          }}
        />
        <Stack.Screen
          name="viewAll/[section]"
          options={{
            headerShown: true,
            headerTitle: "View All",
            headerStyle: { backgroundColor: theme.background },
            headerTitleStyle: { color: theme.text },
            headerTintColor: theme.text,
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="watchlist/[id]"
          options={{
            headerShown: true,
            headerTitle: "Watchlist Details",
            headerStyle: { backgroundColor: theme.background },
            headerTitleStyle: { color: theme.text },
            headerTintColor: theme.text,
            headerShadowVisible: false,
          }}
        />
         <Stack.Screen
          name="explore/explore"
          options={{
            headerShown: true,
            headerTitle: "",
            headerStyle: { backgroundColor: theme.background },
            headerTitleStyle: { color: theme.text },
            headerTintColor: theme.text,
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
