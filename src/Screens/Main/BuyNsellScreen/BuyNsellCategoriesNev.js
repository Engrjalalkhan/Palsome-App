import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Categories from "./BuyNsellScreens/Categories";
import SubCategories from "./BuyNsellScreens/SubCategories";

const Stack = createStackNavigator();

const BuyNsellCategoriesNev = () => {
  return (
    <Stack.Navigator
      initialRouteName="Categories"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="SubCategories" component={SubCategories} />
    </Stack.Navigator>
  );
};

export default BuyNsellCategoriesNev;
