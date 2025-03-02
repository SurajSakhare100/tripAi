import { View, Text, Image } from "react-native";
import React from "react";
import moment from "moment";
import CustomButton from "../CustomButton";
import UserTripCard from "./UserTripCard";
import { useRouter } from "expo-router";

const UserTripList = ({ userTrips }: { userTrips: any[] }) => {
  const router = useRouter();

  const sortedTrips = [...userTrips].sort((a, b) => {
    const aData = JSON.parse(a.tripData);
    const bData = JSON.parse(b.tripData);

    const aStartDate = aData.find((item: any) => item.dates)?.dates?.startDate;
    const bStartDate = bData.find((item: any) => item.dates)?.dates?.startDate;

    return moment(aStartDate).valueOf() - moment(bStartDate).valueOf();
  });

  const LatestTrip = JSON.parse(sortedTrips[0]?.tripData);

  const locationInfo = LatestTrip?.find(
    (item: any) => item.locationInfo
  )?.locationInfo;

  const startDate = LatestTrip?.find((item: any) => item.dates)?.dates
    ?.startDate;
  const endDate = LatestTrip?.find((item: any) => item.dates)?.dates?.endDate;
  const travelersType = LatestTrip?.find((item: any) => item.travelers)
    ?.travelers?.type;

  const isPastTrip = moment().isAfter(moment(endDate));
  return (
    <View className="mb-16">
      <View>
        <Image
          source={{
            uri: `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dHJpcHxlbnwwfHwwfHx8MA%3D%3D`  }}
          className={`w-full h-60 rounded-2xl mt-5 ${isPastTrip ? "grayscale" : ""}`}
        />
        {/* <Image
          source={
            require("@/assets/images/map.jpg")
          }
          className={`w-full h-20 rounded-2xl ${isPastTrip ? "grayscale" : ""}`}
        /> */}

        <View className="mt-3">
          <Text
            className={`font-outfit-medium text-xl ${isPastTrip ? "text-gray-500" : ""
              }`}
          >
            {sortedTrips[0]?.tripPlan?.trip_plan?.location}
          </Text>
          <View className="flex flex-row justify-between items-center mt-2">
            <Text className="font-outfit text-lg text-gray-500">
              {moment(startDate).format("DD MMM yyyy")}
            </Text>
            <Text className="font-outfit-medium mr-5 text-lg text-gray-500">
              🚌 {travelersType}
            </Text>
          </View>

          <CustomButton
            title="View Trip"
            onPress={() =>
              router.push({
                pathname: "/trip-details",
                params: {
                  tripData: sortedTrips[0].tripData,
                  tripPlan: JSON.stringify(sortedTrips[0].tripPlan),
                },
              })
            }
            className={`mt-3 ${isPastTrip ? "opacity-50" : ""}`}
          />
        </View>

        <View className="h-0.5 bg-gray-200 mt-4 mb-2" />

        {sortedTrips?.slice(1).map((trip, idx) => (
          <UserTripCard trip={trip} key={idx} />
        ))}
      </View>
    </View>
  );
};

export default UserTripList;
