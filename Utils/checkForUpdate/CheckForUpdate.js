import { Alert, Linking, Platform } from "react-native";
import VersionCheck from "react-native-version-check";
import { withoutStringiApiCall2 } from "../../src/Services/Apis";

const showForceUpdateAlert = (storeURL, checkForUpdate, token) => {
  Alert.alert(
    "Update Required",
    "A new version of the app is available. Please update to continue.",
    [
      {
        text: "Update Now",
        onPress: async () => {
          await Linking.openURL(storeURL);

          setTimeout(() => checkForUpdate(token, true), 1000);
        },
      },
    ],
    { cancelable: false }
  );
};

const checkForUpdate = async (token, isForceCheck = false) => {
  try {
    const platform = Platform.OS;
    const storeURL =
      platform === "ios"
        ? "https://apps.apple.com/pk/app/palsome/id1617599671"
        : "https://play.google.com/store/apps/details?id=com.palsome";

    const currentVersion = VersionCheck.getCurrentVersion();

    const response = await withoutStringiApiCall2({
      route: `app/version?project=${"palsome"}&platform=${platform}&current_version=${currentVersion}`,
      verb: "GET",
      token,
    });

    if (response?.responseCode !== 200) {
      console.error("API Error:", response);
      return;
    }

    const { latestVersion, force_update: forceUpdate } =
      response.payload?.data?.version || {};
    if (!latestVersion) {
      console.log("Latest version info is unavailable.");
      return;
    }

    if (latestVersion > currentVersion) {
      if (forceUpdate || isForceCheck) {
        showForceUpdateAlert(storeURL, checkForUpdate, token);
      } else {
        Alert.alert(
          "Update Available",
          "A new version of the app is available. Would you like to update?",
          [
            { text: "Later", style: "cancel" },
            { text: "Update Now", onPress: () => Linking.openURL(storeURL) },
          ]
        );
      }
    } else {
      console.log("No update needed.");
    }
  } catch (error) {
    console.error("Error checking for updates:", error);
  }
};

export default checkForUpdate;
