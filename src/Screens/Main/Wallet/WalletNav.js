import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import WalletAuthStack from "./WalletAuthStack";
import WalletMainStack from "./WalletMainStack";

import MyHeader from "../../../Components/MyHeader";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { COLORS } from "../../../Constants/Colors";
import { BASE_URL } from "../../../Services/Constants";
import { createStackNavigator } from "@react-navigation/stack";
import WalletHome from "./WalletHome";

const WalletNav = (props) => {
  const Tab = createMaterialTopTabNavigator();
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.userData);
  // const walletToken = useSelector((state) => state.walletRed.walletToken);
  const walletToken = useSelector((state) => state.walletRed.walletToken);
  const token = useSelector((state) => state.auth.userToken);
  const Stack = createStackNavigator();

  const getWalletToken = () => {
    try {
      const response = withoutStringiApiCall2({
        route: `wallet/action/verification`,
        verb: "POST",
        token: token,
      });
      if (response.responseCode == 200) {
        console.log("Wallet success response>>>", response);
      } else {
        console.log("Eror in wallet response:", response);
      }
    } catch (error) {}

    // await fetch(url, options)
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     console.log("responseJson>>>>>>>>>>>>>", responseJson);
    //   });
  };

  getWalletToken();

  // console.log("walletToken in wallet Nav::>>", walletToken);
  return (
    <SafeAreaView style={styles.container}>
      {/* <MyHeader
        goBack={() => navigation.goBack()}
        //   heading={`${NavParams?.user?.first_name} 's Wallet`}
        heading={` 's Wallet`}
      /> */}
      {/* <Tab.Navigator
        tabBar={() => null}
        initialRouteName="WalletMainStack"
        screenOptions={{ lazy: true, optimizationsEnabled: true }}
      > */}
      <Stack.Navigator
        initialRouteName="WalletHome"
        screenOptions={{
          headerShown: false,
        }}
      >
        {!walletToken ? (
          <Tab.Screen
            name="WalletAuthStack"
            component={WalletAuthStack}
            //   initialParams={{ showAdd: showAdd, userName: NavParams?.user?.name }}
          />
        ) : (
          // <Tab.Screen
          //   name="Settings"
          //   component={WalletMainStack}
          //   //   initialParams={{ showAdd: showAdd, userName: NavParams?.user?.name }}
          // />
          <Stack.Screen name="WalletHome" component={WalletMainStack} />
        )}
      </Stack.Navigator>

      {/* </Tab.Navigator> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
});
export default WalletNav;
