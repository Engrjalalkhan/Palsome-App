import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from "react-native-permissions";
import {
  Platform,
  PermissionsAndroid,
  Alert,
  Linking,
} from "react-native";

// Request Camera Permission
export const requestCameraPermission = async () => {
  if (Platform.OS === "android") {
    try {
      const status = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      if (!status) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera permission to capture images.",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    const status = await check(PERMISSIONS.IOS.CAMERA);
    if (status === RESULTS.GRANTED) {
      return true;
    } else if (status === RESULTS.BLOCKED) {
      Alert.alert(
        "Permissions Required",
        "Camera permissions are blocked. Please enable them in settings.",
        [
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
      return false;
    } else {
      const requestStatus = await request(PERMISSIONS.IOS.CAMERA);
      return requestStatus === RESULTS.GRANTED;
    }
  }
};

// Request Write External Storage Permission
export const requestExternalWritePermission = async () => {
  if (Platform.OS === "android") {
    try {
      const status = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (!status) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "App needs permission to save files.",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};