import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Settings from "../Screens/Main/Settings";
import AddExperience from "../Screens/Main/AddExperience";
import Experience from "../Screens/Main/Experience";
import AddEducation from "../Screens/Main/AddEducation";
import Education from "../Screens/Main/Education";
import Editprofile from "../Screens/Main/EditProfile";
import ProfileSetting from "../Screens/Main/ProfileSetting";
import CreateRoom from "../Screens/Main/CreateRooms";
import EditExperience from "../Screens/Main/EditExperience";
import EditEducation from "../Screens/Main/EditEducation";
import ForgetPassword from "../Screens/Main/ForgetPassword";
import CreateGroup from "../Screens/Main/CreateGroup";
import ShowSingleGroup from "../Screens/Main/ShowSingleGroup";
import VideosSettings from "../Screens/Main/VideosSettings";
import Privacy from "../Screens/Main/Privacy";
import ImageShowScreen from "../Screens/Main/ImageShowScreen";
import FindFriendsModalScreen from "../Screens/Main/FindFriendsModalScreen";
import AllFriendModalScreen from "../Screens/Main/AllFriendModalScreen";
import Rooms from "../Screens/Main/CreateRooms/Rooms";
import RoomFeed from "../Screens/Main/CreateRooms/RoomFeed";
import SecurityAndLogin from "../Screens/Main/SecurityAndLogin";
import Tagging from "../Screens/Main/Tagging";
import Blocking from "../Screens/Main/Blocking";
import LoggedInDevices from "../Screens/Main/LoggedInDevices";
import Deactivating from "../Screens/Main/Deactivating";
import ImgGridModalScreen from "../Screens/Main/ImgGridModalScreen";
import RoomsNav from "../Screens/Main/Rooms/RoomsNav";

const Stack = createStackNavigator();
// @refresh reset

export default function SettingsStack() {
  return (
    <Stack.Navigator
      initialRouteName="Settings"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Settings "
        component={Settings}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddExperience"
        component={AddExperience}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="Experience"
        component={Experience}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddEducation"
        component={AddEducation}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="Education"
        component={Education}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tagging"
        component={Tagging}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="Blocking"
        component={Blocking}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="Deactivating"
        component={Deactivating}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="Editprofile"
        component={Editprofile}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditExperience"
        component={EditExperience}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="SecurityAndLogin"
        component={SecurityAndLogin}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoggedInDevices"
        component={LoggedInDevices}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileSetting"
        component={ProfileSetting}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateRooms"
        component={CreateRoom}
        screenOptions={{ headerShown: false }}
      />

      <Stack.Screen
        name="Room Feed"
        component={RoomFeed}
        screenOptions={{ headerShown: false }}
      />

      <Stack.Screen
        name="Rooms"
        component={Rooms}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditEducation"
        component={EditEducation}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgetPassword"
        component={ForgetPassword}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateGroup"
        component={CreateGroup}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShowSingleGroup"
        component={ShowSingleGroup}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="VideosSettings"
        component={VideosSettings}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImageshowScreen"
        component={ImageShowScreen}
        screenOptions={{ presentation: "modal" }}
        options={{
          headerStyle: { backgroundColor: "black" },
          headerTitle: "",
          headerTintColor: "white",
        }}
      />
      <Stack.Screen name="RoomsHome" component={RoomsNav} />

      <Stack.Screen
        name="FindFriendsModalScreenSettings"
        component={FindFriendsModalScreen}
        screenOptions={{ presentation: "modal" }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="AllFriendModalScreenSettings"
        component={AllFriendModalScreen}
        screenOptions={{ presentation: "modal" }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ImgGridModelScreen"
        component={ImgGridModalScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
