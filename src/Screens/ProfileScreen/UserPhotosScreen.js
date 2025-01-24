import React from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, SafeAreaView, FlatList } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { HP, WP } from "../../../Utils/Resposive";
import PhotosTab from "./PhotosTab";
import VideosTab from "./VideosTab";
import AlbumsTab from "./AlbumsTab";
import MyHeader from "../../Components/MyHeader";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { COLORS } from "../../Constants/Colors";
import { Text } from "react-native";

const UserPhotosScreen = ({ route }) => {
  const { t } = useTranslation();
  const NavParams = route?.params;
  const clip = NavParams?.clip;
  const Tab = createMaterialTopTabNavigator();
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.userData);
  const showAdd = NavParams?.user?.name == user?.name;

  const dummyData = [
    { id: "1", title: "Item 1", description: "Description for Item 1" },
    { id: "2", title: "Item 2", description: "Description for Item 2" },
    { id: "3", title: "Item 3", description: "Description for Item 3" },
    { id: "4", title: "Item 4", description: "Description for Item 4" },
    { id: "5", title: "Item 5", description: "Description for Item 5" },
    // Add more items as needed
  ];

  return (
    <SafeAreaView style={styles.container}>
      <MyHeader
        goBack={() => navigation.goBack()}
        heading={
          clip
            ? `${NavParams?.user?.first_name}'s Clips`
            : `${NavParams?.user?.first_name}'${t("s Albums")}`
        }
      />
      {!clip ? (
        <Tab.Navigator
          initialRouteName="AlbumsTab"
          tabBarOptions={{
            activeTintColor: COLORS.primary,
            inactiveTintColor: COLORS.grey,
            indicatorStyle: styles.indicatorStyle,

            labelStyle: styles.labelStyle,
          }}
          screenOptions={{ lazy: true, optimizationsEnabled: true }}
        >
          <Tab.Screen
            name="AlbumsTab"
            component={AlbumsTab}
            initialParams={{
              showAdd: showAdd,
              userName: NavParams?.user?.name,
            }}
            options={{ tabBarLabel: t("Albums") }}
          />
          <Tab.Screen
            name="PhotossTab"
            component={PhotosTab}
            initialParams={{
              showAdd: showAdd,
              userName: NavParams?.user?.name,
            }}
            options={{ tabBarLabel: t("Photos") }}
          />
          <Tab.Screen
            name="VideosTab"
            component={VideosTab}
            initialParams={{
              showAdd: showAdd,
              userName: NavParams?.user?.name,
            }}
            options={{ tabBarLabel: t("Videos") }}
          />
        </Tab.Navigator>
      ) : (
        <FlatList
          data={dummyData}
          renderItem={({ item }) => renderData(item)}
          numColumns={3}
        />
      )}
    </SafeAreaView>
  );
};
const renderData = (item) => {
  console.log("item", item?.title);
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        margin: 1,
        backgroundColor: "red",
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.cocoGrey,
          height: HP(15),
          width: WP(32.9),
          padding: WP(2),
          alignItems: "center",
          // margin: 0.5,
        }}
      >
        <Text style={{ color: "black" }}>{item?.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  tabStyle: {
    width: WP(95),
    height: HP(100),
    marginTop: HP(0.3),
    paddingHorizontal: WP(4),
    justifyContent: "center",
    alignSelf: "center",
  },
  indicatorStyle: {
    backgroundColor: COLORS.primary,
    height: HP(0.5),
    fontFamily: "Roboto-Regular",
    fontWeight: "900",
  },
  labelStyle: {
    fontSize: 14,
    fontFamily: "Roboto-Bold",
    textTransform: "none",
  },
});
export default UserPhotosScreen;
