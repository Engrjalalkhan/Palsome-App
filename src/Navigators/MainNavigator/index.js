import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FullVideoScreen from "../../Screens/Videos/FullVideoScreen";
import ImageVideoGridSwiperScreen from "../../Screens/Main/ImageVideoGridSwiperScreen";
import AlbumPhotoSwiper from "../../Screens/Main/AlbumPhotoSwiper";
import VideoFullViewScreen from "../../Screens/Main/VideoFullViewScreen";
import myStory from "../../Screens/Main/NewsFeed/mystory/mystory";
import MyStoryDel from "../../Screens/Main/NewsFeed/mystory/myStoryDel";
import PostStory from "../../Screens/Main/PostStory/PostStory";
import CameraScreen from "../../Screens/Main/CameraScreen/CameraScreen";
import ColoredPost from "../../Screens/Main/ColoredPost/ColoredPost";
import WebViewScreen from "../../Screens/Main/WebViewScreen";
import SessionExpiredScreen from "../../Screens/Main/SessionExpiredScreen";
import WalletNav from "../../Screens/Main/Wallet/WalletNav";
import RoomsNav from "../../Screens/Main/Rooms/RoomsNav";
import ReelsNav from "../../Screens/Main/Reels/ReelsNav";
import Splash from "../../Screens/SplashScreen/Splash";
import ViewRoom from "../../Screens/Main/Rooms/ViewRoom";
import Birthday from "../../Screens/Main/Birthday";
import NotificationStackMain from "../NotificationStack";
import ProfileScreen from "../../Screens/ProfileScreen";
import UserPhotosScreen from "../../Screens/ProfileScreen/UserPhotosScreen";
import ShowAlbum from "../../Screens/ProfileScreen/ShowAlbum";
import AllFriendModalScreen from "../../Screens/Main/AllFriendModalScreen";
import ProfileSetting from "../../Screens/Main/ProfileSetting";
import Editprofile from "../../Screens/Main/EditProfile";
import Education from "../../Screens/Main/Education";
import AddEducation from "../../Screens/Main/AddEducation";
import AddExperience from "../../Screens/Main/AddExperience";
import Experience from "../../Screens/Main/Experience";
import FindFriendsModalScreen from "../../Screens/Main/FindFriendsModalScreen";
import ImageShowScreen from "../../Screens/Main/ImageShowScreen";
import EditEducation from "../../Screens/Main/EditEducation";
import EditExperience from "../../Screens/Main/EditExperience";
import BuyNSellNev from "../../Screens/Main/BuyNsellScreen/BuyNsellNev";
import ImgGridModelScreen from "../../Screens/Main/ImgGridModalScreen";
import SearchComponent from "../../Components/SearchComponent";
import SinglePost from "../../Screens/SinglePost";
import DrawerNavigator from "../DrawerNavigator";
import Hashtag from "../../Screens/Main/Hashtag";
import SingleConversation from "../../Screens/ChatGPT/SingleConversation";
import UserClipScreen from "../../Screens/ProfileScreen/UserClipScreen";
import GroupsNav from "../../Screens/Main/Groups/GroupsNav";
import EventsNav from "../../Screens/Main/Events/EventsNav";
import BuyNsellScreen from "../../Screens/Main/BuyNsellScreen";
import ExploreDetailScreen from "../../Screens/Main/BuyNsellScreen/Component/Explore/ExploreDetailScreen";
import BuyNsellCategoriesNev from "../../Screens/Main/BuyNsellScreen/BuyNsellCategoriesNev";
import FilterScreen from "../../Screens/Main/BuyNsellScreen/BuyNsellScreens/Filter";
import BuyNsellShowImage from "../../Screens/Main/BuyNsellScreen/BuyNsellScreens/BuyNsellShowImage";
import SwitchUserLogIn from "../../Screens/Authentication/SwithUserLogInScreen";
import SwitchUserStack from "../SwitchUserStack";
import SwitchUserAnimated from "../../Screens/Main/SwitchUserAnimatedScreen";
import AnimationScreen from "../../Screens/AnimationScreens";
import LanguageScreen from "../../Screens/Main/LanguageScreen";
import RemindersScreen from "../../Screens/Main/ReminderScreen";
import SwitchLanguageAnimated from "../../Screens/Main/LanguageScreen/SwitchLanguesAnimated";
import RemindersDetailScreen from "../../Screens/Main/ReminderScreen/ReminedersDetailScreen";
import SavedPostsScreen from "../../Screens/Main/SavedPost";
import MyCollection from "../../Screens/Main/SavedPost/MyCollection";
import GotoCallingsApp from "../../Screens/Common/GotoCallingsApp";
import Museum from "../../Screens/ProfileScreen/Museum";


const Stack = createStackNavigator();
const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="SinglePost" component={SinglePost} />
      <Stack.Screen name="MyTopTabs" component={DrawerNavigator} />
      <Stack.Screen name="SingleConversation" component={SingleConversation} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="Museum" component={Museum} />

      <Stack.Screen name="ProfileScreenSettings" component={ProfileScreen} />
      <Stack.Screen name="Groups" component={GroupsNav} />
      <Stack.Screen name="Events" component={EventsNav} />
      <Stack.Screen name="GotoCallings" component={GotoCallingsApp} />

      <Stack.Screen name="RemindersScreen" component={RemindersScreen} />
      <Stack.Screen
        name="RemindersDetailScreen"
        component={RemindersDetailScreen}
      />

      <Stack.Screen name="UserPhotosScreen" component={UserPhotosScreen} />
      <Stack.Screen name="UserClipScreen" component={UserClipScreen} />
      <Stack.Screen name="ShowAlbum" component={ShowAlbum} />
      <Stack.Screen name="AnimationScreen" component={AnimationScreen} />
      <Stack.Screen
        name="SwitchLanguageAnimated"
        component={SwitchLanguageAnimated}
      />

      <Stack.Screen name="LanguageScreen" component={LanguageScreen} />

      <Stack.Screen
        name="FullVideoScreen"
        component={FullVideoScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="SwitchUserLogIn" component={SwitchUserLogIn} />

      <Stack.Screen
        name="ImageVideoGridSwiperScreen"
        component={ImageVideoGridSwiperScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "vertical",
          animationEnabled: false,
          gestureResponseDistance: 10,
          gestureVelocityImpact: 0.1,
        }}
        screenOptions={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="AlbumPhotoSwiper"
        component={AlbumPhotoSwiper}
        options={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "vertical",
          animationEnabled: false,
          gestureResponseDistance: 10,
          gestureVelocityImpact: 0.1,
        }}
        screenOptions={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
        options={{
          headerShown: false,
        }}
        screenOptions={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="VideoFullViewScreen"
        component={VideoFullViewScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "vertical",
          animationEnabled: false,
          gestureResponseDistance: 10,
          gestureVelocityImpact: 0.1,
        }}
        screenOptions={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="myStory"
        component={myStory}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="myStoryDel"
        component={MyStoryDel}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostStory"
        component={PostStory}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen name="ColoredPost" component={ColoredPost} />
      <Stack.Screen
        name="SessionExpiredScreen"
        component={SessionExpiredScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: "vertical",
          animationEnabled: false,
          gestureResponseDistance: 10,
          gestureVelocityImpact: 0.1,
        }}
        screenOptions={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="WalletNav"
        component={WalletNav}
        screenOptions={{ presentation: "modal" }}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="RoomsNav"
        component={RoomsNav}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="ReelsNav"
        component={ReelsNav}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ViewRoom"
        component={ViewRoom}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="NotificationStackMain"
        component={NotificationStackMain}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Birthday"
        component={Birthday}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="BuyNsellScreen"
        component={BuyNsellScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ExploreDetailScreen"
        component={ExploreDetailScreen}
      />
      {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
      <Stack.Screen name="Categories" component={BuyNsellCategoriesNev} />
      <Stack.Screen name="FilterScreen" component={FilterScreen} />
      <Stack.Screen name="BuyNsellShowImage" component={BuyNsellShowImage} />
      <Stack.Screen
        name="AllFriendModalScreenFriendStack"
        component={AllFriendModalScreen}
        screenOptions={{ presentation: "modal" }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProfileSetting"
        component={ProfileSetting}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="Editprofile"
        component={Editprofile}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="Education"
        component={Education}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddEducation"
        component={AddEducation}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditEducation"
        component={EditEducation}
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
        name="EditExperience"
        component={EditExperience}
        screenOptions={{ headerShown: false }}
      />

      <Stack.Screen
        name="FindFriendsModalScreenSettings"
        component={FindFriendsModalScreen}
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
          headerStyle: { backgroundColor: "black" },
          headerTitle: "",
          headerTintColor: "white",
        }}
      />
      <Stack.Screen
        name="BuyNSellNav"
        component={BuyNSellNev}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="ImgGridModelScreen"
        component={ImgGridModelScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchComponent"
        component={SearchComponent}
        screenOptions={{ presentation: "modal" }}
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
        name="Hashtag"
        component={Hashtag}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="SwitchUserStack"
        component={SwitchUserStack}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="SwitchUserAnimated"
        component={SwitchUserAnimated}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="SavedPostsScreen"
        component={SavedPostsScreen}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyCollection"
        component={MyCollection}
        screenOptions={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
