import React from "react";
import NewsFeed from "../Screens/Main/NewsFeed";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "../Screens/ProfileScreen";
import SearchComponent from "../Components/SearchComponent";
import AllFriendModalScreen from "../Screens/Main/AllFriendModalScreen";
import ImageShowScreen from "../Screens/Main/ImageShowScreen";
import ImgGridModelScreen from "../Screens/Main/ImgGridModalScreen";
import FindFriendsModalScreen from "../Screens/Main/FindFriendsModalScreen";
import Editprofile from "../Screens/Main/EditProfile";
import Hashtag from "../Screens/Main/Hashtag";
import myStory from "../Screens/Main/NewsFeed/mystory/mystory";
import MyStoryDel from "../Screens/Main/NewsFeed/mystory/myStoryDel";
import UserPhotosScreen from "../Screens/ProfileScreen/UserPhotosScreen";
import ShowAlbum from "../Screens/ProfileScreen/ShowAlbum";
import { COLORS } from "../Constants/Colors";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="NewsFeed"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="NewsFeed" component={NewsFeed} />
      {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="UserPhotosScreen" component={UserPhotosScreen} />
      <Stack.Screen name="ShowAlbum" component={ShowAlbum} /> */}
      <Stack.Screen
        name="SearchComponent"
        component={SearchComponent}
        screenOptions={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="AllFriendModalScreen"
        component={AllFriendModalScreen}
        screenOptions={{ presentation: "modal" }}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="FindFriendsModalScreen"
        component={FindFriendsModalScreen}
        screenOptions={{ presentation: "modal" }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ImageshowScreen"
        component={ImageShowScreen}
        screenOptions={{ presentation: "modal" }}
        options={{
          headerStyle: { backgroundColor: COLORS.black },
          headerTitle: "",
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="ImgGridModelScreen"
        component={ImgGridModelScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Editprofile"
        component={Editprofile}
        screenOptions={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Hashtag"
        component={Hashtag}
        screenOptions={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};

export default HomeStack;
