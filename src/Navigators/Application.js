import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./Auth";
import MainNavigator from "./Main";
import Loading from "./Loading";
const MainApp = createStackNavigator();

// @refresh reset
const ApplicationNavigator = () => {
  return (
    <NavigationContainer>
      <MainApp.Navigator
        initialRouteName="Loading"
        screenOptions={{
          headerShown: false,
        }}
      >
        <MainApp.Screen name="Loading" component={Loading} />
        <MainApp.Screen name="Auth" component={AuthNavigator} />
        <MainApp.Screen name="Main" component={MainNavigator} />
      </MainApp.Navigator>
    </NavigationContainer>
  );
};

export default ApplicationNavigator;
