import { View, Text, Image } from "react-native";
import React from "react";
import moment from "moment";
import CustomButton from "../CustomButton";
import { useRouter } from "expo-router";

const UserTripCard = ({ trip }: { trip: any }) => {
  const router = useRouter();

  const tripData = JSON.parse(trip?.tripData || "[]");
  const locationInfo = tripData?.find((item: any) => item.locationInfo)?.locationInfo;
  const startDate = tripData?.find((item: any) => item.dates)?.dates?.startDate;
  const endDate = tripData?.find((item: any) => item.dates)?.dates?.endDate;
  const isPastTrip = endDate ? moment().isAfter(moment(endDate)) : false;

  return (
    <View className="mt-5 flex flex-row gap-3">
      <View className="w-32 h-32">
        <Image
          source={{
             uri: `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJpcHxlbnwwfHwwfHx8MA%3D%3D`    
          }}
          className={`w-full h-full rounded-2xl ${isPastTrip ? "grayscale" : ""}`}
        />
      </View>
      <View className="flex-1">
        <Text
          className={`font-outfit-medium text-lg ${isPastTrip ? "text-gray-500" : ""}`}
          numberOfLines={2}
        >
          {trip?.tripPlan?.trip_plan?.location || "Unknown Location"}
        </Text>
        <Text className="font-outfit text-md text-gray-500 mt-1">
          {startDate ? moment(startDate).format("DD MMM yyyy") : "No Date"}
        </Text>
        <Text className="font-outfit-medium text-md text-gray-500 mt-1">
          {trip?.tripPlan?.trip_plan?.group_size?.split(" ")[0] || "N/A"}
        </Text>
      </View>
      <View className="flex-1">
        <CustomButton
          title="View Trip"
          onPress={() =>
            router.push({
              pathname: "/trip-details",
              params: {
                tripData: trip.tripData,
                tripPlan: JSON.stringify(trip.tripPlan),
              },
            })
          }
          disabled={isPastTrip}
          className={`mt-2 py-0.5 ${isPastTrip ? "opacity-50" : ""}`}
        />
      </View>
    </View>
  );
};

export default UserTripCard;
