import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import FastImage from "react-native-fast-image";
import Modal from "react-native-modal";
import { SITE_URL } from "../../Services/Constants";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import ReactNativeZoomableView from "../Zoom";

const MyFastImage = ({ source }) => {
  const [loading, setLoading] = useState(true);
  return (
    <>
      <FastImage
        style={{
          // flex: 1,
          width: null,
          height: "100%",
        }}
        source={source}
        resizeMode="contain"
        onLoadEnd={() => setLoading(false)}
      />
      <ActivityIndicator
        animating={loading}
        size={"large"}
        color={COLORS.primary}
        style={{
          position: "absolute",
          top: "50%",
          alignSelf: "center",
        }}
      />
    </>
  );
};
const OnlyOneImageModal = (props) => {
  const image = props.image;
  return (
    <Modal
      propagateSwipe
      avoidKeyboard={true}
      backdropOpacity={0.3}
      isVisible={props.modalVisible}
      onBackdropPress={() => {
        props.setModalVisible(false);
      }}
      swipeDirection={["down"]}
      style={styles.modal}
      onRequestClose={() => {
        props.setModalVisible(false);
      }}
      onSwipeComplete={() => {
        props.setModalVisible(false);
      }}
    // statusBarTranslucent={false}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={{
            position: "absolute",
            right: 15,
            top: 50,
            zIndex: 1000,
          }}
          onPress={() => props.setModalVisible(false)}
        >
          {ICONS.materialIcons("cancel", COLORS.gray, 35)}
        </TouchableOpacity>

        <ReactNativeZoomableView
          maxZoom={1.5}
          minZoom={1}
          initialZoom={1}
          bindToBorders={true}
          doubleTapZoomToCenter
          style={{
            padding: 1,
            backgroundColor: COLORS.black,
          }}
        >
          <MyFastImage
            source={{
              //   uri: SITE_URL + item.path,
              uri:
                image?.post_file_type == "image"
                  ? SITE_URL + image.path
                  : image.uri,
            }}
          />
        </ReactNativeZoomableView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.black },
  modal: { margin: 0 },
});
export default OnlyOneImageModal;
