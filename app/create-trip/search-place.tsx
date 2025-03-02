// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   TouchableWithoutFeedback,
//   Keyboard,
// } from "react-native";
// import React, { useContext, useEffect } from "react";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation, useRouter } from "expo-router";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
// import { CreateTripContext } from "@/context/CreateTripContext";

// const SearchPlace = () => {
//   const router = useRouter();
//   const { setTripData } = useContext(CreateTripContext);

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View>
//         <View className="flex flex-col items-center">
//           <Text className="text-5xl font-outfit-bold mt-20 px-3 mb-2">
//             Where do you want to go?
//           </Text>
//           <Text className="text-lg text-gray-400 font-outfit">
//             Find your destination!
//           </Text>
//         </View>

//         <View className="p-6 mt-10 h-full w-full flex">
//           <GooglePlacesAutocomplete
//             placeholder="Search for a place"
//             textInputProps={{
//               placeholderTextColor: "#818181",
//               returnKeyType: "search",
//               onSubmitEditing: (e) => {
//                 if (e.nativeEvent.text.trim()) {
//                   router.push("/create-trip/select-traveler");
//                 }
//               },
//               clearButtonMode: "never",
//             }}
//             fetchDetails={true}
//             enablePoweredByContainer={false}
//             onPress={(data, details = null) => {
//               setTripData((prev) => {
//                 const newData = prev.filter((item) => !item.locationInfo);
//                 return [
//                   ...newData,
//                   {
//                     locationInfo: {
//                       name: data.description,
//                       coordinates: details?.geometry.location,
//                       url: details?.url,
//                       // @ts-ignore
//                       photoRef: details?.photos?.[0]?.photo_reference,
//                     },
//                   },
//                 ];
//               });
//               router.push("/create-trip/select-traveler");
//             }}
//             query={{
//               key: process.env.EXPO_PUBLIC_GOOGLE_MAP_KEY,
//               language: "en",
//             }}
//             styles={{
//               container: {
//                 flex: 0,
//               },
//               textInput: {
//                 height: 54,
//                 backgroundColor: "#e2e2e2",
//                 borderRadius: 999,
//                 paddingHorizontal: 16,
//                 fontSize: 15,
//                 fontFamily: "outfit-medium",
//               },
//               listView: {
//                 backgroundColor: "#fff",
//                 borderRadius: 8,
//                 marginTop: 8,
//               },
//               row: {
//                 padding: 13,
//                 height: 50,
//                 flexDirection: "row",
//                 backgroundColor: "#fff",
//                 alignItems: "center",
//               },
//               separator: {
//                 height: 0.5,
//                 backgroundColor: "#c8c7cc",
//               },
//               description: {
//                 fontSize: 15,
//                 fontFamily: "outfit",
//               },
//               predefinedPlacesDescription: {
//                 color: "#666666",
//               },
//               textInputContainer: {
//                 color: "#b5b3b3",
//               },
//               clearButton: {
//                 color: "#b5b3b3",
//               },
//             }}
//           />
//         </View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// };

// export default SearchPlace;import React, { useContext, useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, Button } from "react-native";
import { useRouter } from "expo-router";
import { CreateTripContext } from "@/context/CreateTripContext";
import { useContext, useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";

let timeoutId; // Debounce timeout

const SearchPlace = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);

  useEffect(() => {
    if (query.length > 2) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fetchAddresses(query), 500); // Add a delay
    } else {
      setSuggestions([]);
    }
    return () => clearTimeout(timeoutId);
  }, [query]);

  const fetchAddresses = async (text) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${text}&format=json&addressdetails=1`,
        {
          headers: {
            "User-Agent": "YourAppName/1.0 (your@email.com)",
          },
        }
      );

      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Handle place selection
  const handleSelectPlace = (item) => {
    setQuery(item.display_name);
    setSelectedPlace(item);
  };

  // Handle button press to update trip data & navigate
  const handleConfirm = () => {
    if (!selectedPlace) return;

    setTripData((prev) => {
      const newData = prev.filter((item) => !item.locationInfo);
      return [
        ...newData,
        {
          locationInfo: {
            name: selectedPlace.display_name,
            coordinates: {
              lat: selectedPlace.lat,
              lon: selectedPlace.lon,
            },
            url: `https://www.openstreetmap.org/?mlat=${selectedPlace.lat}&mlon=${selectedPlace.lon}`,
            photoRef: null, // OpenStreetMap doesn’t provide photos
          },
        },
      ];
    });

    router.push("/create-trip/select-traveler");
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {/* Search Input */}
      <TextInput
        style={{
          height: 40,
          borderBottomWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 8,
        }}
        placeholder="Enter city or address"
        value={query}
        onChangeText={setQuery} // Use setQuery directly (debounced)
      />

      {/* Address Suggestions List */}
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.place_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectPlace(item)}>
            <Text style={{ padding: 5, borderBottomWidth: 0.5 }}>
              {item.display_name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Confirm Button (only shows if a place is selected) */}
      {selectedPlace && (
        <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
          <CustomButton title="Confirm & Continue" onPress={handleConfirm} />
        </View>
      )}
    </View>
  );
};

export default SearchPlace;
