import {
  requestCameraPermission,
  requestExternalWritePermission,
} from "../../Utils/ImageAndCamera";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

export const captureImage = async (props) => {
  props.setColorVisibility(true);
  let options = {
    mediaType: props.str,
    quality: 1,
    noData: true,
    videoQuality: "high",
    durationLimit: 30,
    maxWidth: 500,
    maxHeight: 500,
  };

  let isCameraPermitted = await requestCameraPermission();
  let isStoragePermitted = await requestExternalWritePermission();
  if (isCameraPermitted) {
    launchCamera(options, (response) => {
      if (response.didCancel) {
        props.setColorVisibility(false);
        return;
      } else if (response.errorCode == "camera_unavailable") {
        props.setColorVisibility(false);
        return;
      } else if (response.errorCode == "permission") {
        props.setColorVisibility(false);
        return;
      } else if (response.errorCode == "others") {
        props.setColorVisibility(false);
        return;
      }
      let uri = response?.assets[0]?.uri;
      let type = response?.assets[0]?.type
        ? response?.assets[0]?.type
        : "video/mp4";
      let name = response?.assets[0]?.fileName;
      props.setImageToUpload(uri);
      const MyObject = { uri, type, name };
      props.setImageObject(MyObject);
      props.setPickerModalVisibile(false);

      if (response.assets.length) {
        props.setMultipleImages(() => {
          let newImgs = response.assets.map((item, index) => {
            return {
              uri: item.uri,
              type: item.type ? item.type : "video/mp4",
              name: item.fileName,
            };
          });
          return newImgs;
        });
        // snapURI ? props.setSnapURI("") : null;
      }
    });
  }
};
