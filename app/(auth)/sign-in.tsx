import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";
import DummyLogin from "@/components/DummyLogin";

const SignIn = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const onLoginPress = async () => {
    try {
      if (!form.email || !form.password) {
        alert("Please fill in all fields");
        return;
      }
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Successfully signed in
      const user = userCredential.user;
      router.replace("/(tabs)/mytrip");
    } catch (error:any) {
      switch (error.code) {
        case "auth/invalid-email":
          alert("Invalid email address");
          break;
        case "auth/user-disabled":
          alert("This account has been disabled");
          break;
        case "auth/user-not-found":
          alert("No account found with this email");
          break;
        case "auth/wrong-password":
          alert("Incorrect password");
          break;
        default:
          alert("Error signing in: " + error.message);
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FFF5F5] justify-center">
      <View className="flex-1 items-center px-6 pt-16 justify-center">
        

        {/* Welcome Message */}
        <Text className="text-3xl font-bold text-red-600 mt-5">
          Welcome Back!
        </Text>
        <Text className="text-lg text-gray-500 mt-2">
          Your AI-powered trip planner is ready 🚀
        </Text>

        {/* Input Fields */}
        <View className="w-full mt-8">
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={true}
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          {/* Sign-In Button */}
          <CustomButton
            title={isLoading ? "Logging In..." : "Log In"}
            onPress={onLoginPress}
            className="mt-6 bg-red-600 text-white"
            disabled={isLoading}
          />
        </View>

        <DummyLogin />

        {/* Sign Up Link */}
        <Link href="/(auth)/sign-up" className="text-lg text-gray-600 mt-6">
          <Text>New here? </Text>
          <Text className="text-red-600 font-bold">Sign Up</Text>
        </Link>
      </View>
    </View>
  );
};

export default SignIn;
