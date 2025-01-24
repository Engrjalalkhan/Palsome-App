import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ReelsIndex from "./index";
import ShareReelSuggestions from "./components/ShareReelSuggestions";
import SingleReel from "./SingleReel";

const Stack = createStackNavigator();

const ReelsNav = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReelsIndex" component={ReelsIndex} />
      <Stack.Screen name="SingleReel" component={SingleReel} />
      <Stack.Screen name="ReelSuggestions" component={ShareReelSuggestions} />
    </Stack.Navigator>
  );
};

export default ReelsNav;
