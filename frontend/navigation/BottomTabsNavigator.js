import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons"; // 1. Import Icon library

import HomeScreen from "../screens/HomeScreen";
import FindDonorScreen from "../screens/FindDonorScreen";
import RequestScreen from "../screens/RequestScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName;

          // 2. Setup different icons based on route name
          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "FindDonor") {
            iconName = "search-outline";
          } else if (route.name === "Request") {
            iconName = "add-circle-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          // 3. Return icon
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="FindDonor" component={FindDonorScreen} />
      <Tab.Screen name="Request" component={RequestScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
