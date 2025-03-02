import { View, TextInput, FlatList, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { CreateTripContext } from "@/context/CreateTripContext";
import { useContext, useEffect, useState, useRef } from "react";
import CustomButton from "@/components/CustomButton";

const SearchPlace = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setTripData } = useContext(CreateTripContext);
  const timeoutRef = useRef(null);
  const abortController = useRef(null);

  useEffect(() => {
    if (query.length > 2) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => fetchAddresses(query), 500);
    } else {
      setSuggestions([]);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  const fetchAddresses = async (text) => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${text}&format=json&addressdetails=1`,
        {
          signal: abortController.current.signal,
          headers: { "User-Agent": "YourAppName/1.0 (your@email.com)" },
        }
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching data:", error);
      }
    }
    setLoading(false);
  };

  const handleSelectPlace = (item) => {
    setQuery(item.display_name);
    setSelectedPlace(item);
    setSuggestions([]);
  };

  const handleConfirm = () => {
    if (!selectedPlace) return;

    setTripData((prev) => [
      ...prev.filter((item) => !item.locationInfo),
      {
        locationInfo: {
          name: selectedPlace.display_name,
          coordinates: {
            lat: selectedPlace.lat,
            lon: selectedPlace.lon,
          },
          url: `https://www.openstreetmap.org/?mlat=${selectedPlace.lat}&mlon=${selectedPlace.lon}`,
          photoRef: null,
        },
      },
    ]);

    router.push("/create-trip/select-traveler");
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        style={{
          height: 40,
          borderBottomWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 8,
        }}
        placeholder="Enter city or address"
        value={query}
        onChangeText={setQuery}
      />

      {loading && <ActivityIndicator size="small" color="#0000ff" />}

      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.place_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectPlace(item)}>
            <Text style={{ padding: 5, borderBottomWidth: 0.5 }}>{item.display_name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={!loading && query.length > 2 && suggestions.length === 0 ? (
          <Text style={{ padding: 5, textAlign: "center" }}>No results found</Text>
        ) : null}
      />

      {selectedPlace && (
        <View style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
          <CustomButton title="Confirm & Continue" onPress={handleConfirm} />
        </View>
      )}
    </View>
  );
};

export default SearchPlace;
