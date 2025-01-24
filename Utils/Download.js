import RNFetchBlob from "rn-fetch-blob";
import { getApiLevel } from "react-native-device-info";
import { Alert, Linking, Platform } from "react-native";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions";

const checkPermissions = async (callback) => {
  if (Platform.OS == "ios") {
    check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(async (result) => {
      if (result == RESULTS.DENIED) {
        const reqRes = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

        if (reqRes == RESULTS.GRANTED || reqRes == RESULTS.LIMITED) {
          callback(true);
        } else {
          Alert.alert("Sorry..!!", "We need permissions");
        }
      } else if (result == RESULTS.GRANTED || result == RESULTS.LIMITED) {
        callback(true);
      } else if (result == RESULTS.UNAVAILABLE) {
        Alert.alert(
          "Sorry..!!",
          "This feature is not available on your device"
        );
      } else {
        Alert.alert(
          "Permission not granted",
          "Go to settings and grant permissions",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            { text: "Open settings", onPress: () => Linking.openSettings() },
          ]
        );
      }
    });

    return;
  }

  if (Platform.OS == "android") {
    const apiLevel = await getApiLevel();
    const permissionToCheck =
      apiLevel < 33
        ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
        : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

    check(permissionToCheck).then(async (result) => {
      if (result == RESULTS.DENIED) {
        const reqRes = await request(permissionToCheck);

        if (reqRes == RESULTS.GRANTED) callback(true);
        else {
          Alert.alert(
            "We need permissions to save",
            "Go to settings and grant permissions",
            [
              {
                text: "Cancel",
              },
              { text: "Open settings", onPress: () => Linking.openSettings() },
            ]
          );
        }
      } else if (result == RESULTS.GRANTED) callback(true);
    });
  }
};

const getDirectoryPth = (callback) => {
  checkPermissions(async (res) => {
    if (res) {
      let dir = RNFetchBlob.fs.dirs;

      if (Platform.OS == "ios") {
        dir = `${dir.DocumentDir}/Palsome`;
      } else if (Platform.OS == "android") {
        dir = `${dir.PictureDir}/Palsome`;
      }

      const isDirAvailable = await RNFetchBlob.fs.isDir(dir);

      if (!isDirAvailable) {
        const result = await RNFetchBlob.fs.mkdir(dir);
        if (result) callback(dir);
        else console.log("dirError: ", result);
      } else {
        callback(dir);
      }
    }
  });
};

export const downloadAndSave = (url, callback) => {
  try {
    const name = Date.now();
    const ext = JSON.stringify(url)
      .split("/")
      .pop()
      .replace('"', "")
      .split(".")
      .pop();

    const nameWithExt = `${name}.${ext}`;

    getDirectoryPth(async (path) => {
      const imgAddress = `${path}/${nameWithExt}`;

      RNFetchBlob.config({ path: imgAddress })
        .fetch("GET", url)
        .then((image) => {
          CameraRoll.save(image.path(), {
            type: "photo",
            album: "Palsome",
          })
            .then(() => {
              callback(true);
            })
            .catch((error) => {
              callback(false);
              console.log("saveError: ", error);
            });
        })
        .catch((error) => {
          callback(false);
          console.log("error: ", error);
        });
    });
  } catch (error) {
    callback(false);
    console.log("catch error ", error);
  }
};
