import { View, Text, Button } from "react-native";
import React from "react";
import CustomButton from "./CustomButton";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";
import { router } from "expo-router";

const DummyLogin = () => {
  const handleDummyLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        "testuser@gmail.com",
        "testuser123"
      );

      const user = userCredential.user;

      router.replace("/(tabs)/mytrip");
    } catch (error: any) {
      console.error("Error signing in with dummy account:", error);
      alert("Error signing in with dummy account. Please try again.");
    }
  };

  return (
    <View>
      <View className="flex flex-row justify-center items-center mt-4 gap-x-3">
        <View className="flex-1 h-[1px] bg-neutral-100" />
        <Text className="text-2xl">Or</Text>
        <View className="flex-1 h-[1px] bg-neutral-100" />
      </View>
     <View>
      <CustomButton title="Login As Guest"  bgVariant="undefined" className="bg-gray-200 mt-6"/>
     </View>

    </View>
  );
};

export default DummyLogin;
