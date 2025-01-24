import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import BuyNsellScreen from "./index";
import ExploreDetailScreen from "./Component/Explore/ExploreDetailScreen";
import FilterScreen from "./BuyNsellScreens/Filter";
import BuyNsellCategoriesNev from "./BuyNsellCategoriesNev";
import BuyNsellShowImage from "./BuyNsellScreens/BuyNsellShowImage";

const Stack = createStackNavigator();

const BuyNSellNev = () => {
  return (
    <Stack.Navigator
      initialRouteName="BuyNsellScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="BuyNsellScreen" component={BuyNsellScreen} />
      <Stack.Screen
        name="ExploreDetailScreen"
        component={ExploreDetailScreen}
      />
      {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
      <Stack.Screen name="Categories" component={BuyNsellCategoriesNev} />
      <Stack.Screen name="FilterScreen" component={FilterScreen} />
      <Stack.Screen name="BuyNsellShowImage" component={BuyNsellShowImage} />
    </Stack.Navigator>
  );
};

export default BuyNSellNev;
