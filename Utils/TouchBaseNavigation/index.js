import { Alert, Linking } from "react-native";

export const onPressTouchBase = (
  user,
  currentUserId,
  messenger,
  navigation
) => {
  let email = user.email;
  let last_name = user.last_name;
  let first_name = user.first_name;

  const chatUser = {
    bolcked_by: [],
    email: email,
    // chat_id: 204,
    id: user?.user_id,
    // conversation: null,
    gender: user?.gender,
    last_name: last_name,
    first_name: first_name,
    profile_picture: user?.profile_picture,
  };
  const userId1 = currentUserId < user?.user_id ? currentUserId : user?.user_id;
  const userId2 = currentUserId < user?.user_id ? user?.user_id : currentUserId;

  const id = `TouchBaseConverastion-${userId1}-${userId2}`;
  const archived = false;
  const fromPalsome = true;
  const appStoreLink = "https://apps.apple.com/pk/app/callings/id6479602578";
  const playStoreLink =
    "https://play.google.com/store/apps/details?id=com.callings";

  const deepLinkUrl = `touchBase://Message/${id}/${encodeURIComponent(
    JSON.stringify(chatUser)
  )}/${archived}/${fromPalsome}`;

  const url = "touchBase://";
  const appStoreURL = Platform.OS === "ios" ? appStoreLink : playStoreLink;
  const isAndroid = Platform.OS === "android" && true;

  Linking.canOpenURL(url)
    .then((supported) => {
      if (isAndroid ? !supported : supported) {
        console.log("App is installed, opening...");

        try {
          Linking.openURL(messenger ? url : deepLinkUrl).catch((err) => {
            console.error("Error opening URL:", err);
            // Alert.alert(
            //   "App Not Installed",
            //   "Would you like to install the app?",
            //   [
            //     {
            //       text: "Cancel",
            //       style: "cancel",
            //     },
            //     {
            //       text: "Install",
            //       onPress: () => {
            //         try {
            //           Linking.openURL(appStoreURL).catch((err) => {
            //             console.error("Error opening store URL:", err);
            //             Alert.alert(
            //               "Error",
            //               "Failed to open the store. Please try again later."
            //             );
            //           });
            //         } catch (error) {
            //           console.error(
            //             "Unexpected error during store URL open:",
            //             error
            //           );
            //           Alert.alert(
            //             "Error",
            //             "Something went wrong. Please try again."
            //           );
            //         }
            //       },
            //     },
            //   ],
            //   { cancelable: false }
            // );
            navigation.navigate("GotoCallings");
          });
        } catch (error) {
          console.error("Unexpected error:", error);
          Alert.alert("Error", "Something went wrong. Please try again.");
        }
      } else {
        console.log("App not installed, redirecting to store...");

        navigation.navigate("GotoCallings");
      }
    })
    .catch((err) => {
      console.error("An error occurred during URL check", err);

      // Always show the "App Not Installed" alert when URL scheme fails
      Alert.alert(
        "App Not Installed",
        "Would you like to install the app?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Install",
            onPress: () => Linking.openURL(appStoreURL),
          },
        ],
        { cancelable: false }
      );
    });
};
