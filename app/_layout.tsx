import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import "react-native-get-random-values";
import { CreateTripContext } from "@/context/CreateTripContext";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [tripData, setTripData] = useState<any[]>([]);

  const updateTripData = (newData: any) => {
    setTripData((prevData) => {
      const dataKey = Object.keys(newData)[0];

      const filteredData = prevData.filter((item) => !item[dataKey]);

      return [...filteredData, newData];
    });
  };

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "outfit": require("@/assets/fonts/Outfit-Regular.ttf"),
    "outfit-medium": require("@/assets/fonts/Outfit-Medium.ttf"),
    "outfit-bold": require("@/assets/fonts/Outfit-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <CreateTripContext.Provider value={{ tripData, setTripData }}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="create-trip" />
          <Stack.Screen name="generate-trip" />
        </Stack>
      </CreateTripContext.Provider>
    </>
  );
}
