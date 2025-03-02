import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { auth } from "@/config/FirebaseConfig";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#F75A41" />
      </View>
    );
  }

  if (user) return <Redirect href="/(tabs)/mytrip" />;

  return <Redirect href="/(auth)/welcome" />;
}
