import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import InputField from "@/components/InputField";
import CustomButton from "@/components/CustomButton";
import { Link, router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/config/FirebaseConfig";
import DummyLogin from "@/components/DummyLogin";

const SignUp = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const onSignUpPress = async () => {
    try {
      if (!form.email || !form.password || !form.name) {
        alert("Please fill in all fields");
        return;
      }
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;
      console.log(user);
      router.replace("/(tabs)/mytrip");
    } catch (error:any) {
      switch (error.code) {
        case "auth/email-already-in-use":
          alert("This email is already registered");
          break;
        case "auth/invalid-email":
          alert("Invalid email address");
          break;
        case "auth/weak-password":
          alert("Password should be at least 6 characters");
          break;
        default:
          alert("Error creating account: " + error.message);
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FFF5F5] items-center px-6 pt-16 justify-center">
      

      {/* Welcome Message */}
      <Text className="text-3xl font-bold text-red-600 mt-5">
        Create Your Account
      </Text>
      <Text className="text-lg text-gray-500 mt-2 text-center">
        Sign up to plan your journeys with AI-powered recommendations ✈️
      </Text>

      {/* Input Fields */}
      <View className="w-full mt-8">
        <InputField
          label="Name"
          placeholder="Enter your name"
          value={form.name}
          onChangeText={(value) => setForm({ ...form, name: value })}
        />
        <InputField
          label="Email"
          placeholder="Enter your email"
          value={form.email}
          onChangeText={(value) => setForm({ ...form, email: value })}
        />
        <InputField
          label="Password"
          placeholder="Enter a secure password"
          secureTextEntry={true}
          value={form.password}
          onChangeText={(value) => setForm({ ...form, password: value })}
        />

        {/* Sign-Up Button */}
        <CustomButton
          title={isLoading ? "Creating Account..." : "Sign Up"}
          onPress={onSignUpPress}
          className="mt-6 bg-red-600 text-white"
          disabled={isLoading}
        />
      </View>

      <DummyLogin />

      {/* Sign In Link */}
      <Link href="/(auth)/sign-in" className="text-lg text-gray-600 mt-6">
        <Text>Already have an account? </Text>
        <Text className="text-red-600 font-bold">Sign In</Text>
      </Link>
    </View>
  );
};

export default SignUp;
