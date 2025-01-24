import { useTranslation } from "react-i18next";
import React, { memo, useEffect, useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { getHeight, getWidth } from "../../../Utils/NewResponsive";
import { COLORS } from "../../Constants/Colors";
import { ICONS } from "../../Constants/Icons";

const TextInputForComments = (props) => {
  const { t } = useTranslation();

  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        height:
          keyboardStatus && Platform.OS === "ios"
            ? getHeight(53)
            : getHeight(15),
      }}
    >
      {props.isReplying && (
        <View style={styles.isReplyingContainer}>
          <Text>{t("Replying to")}</Text>
          <Text style={styles.nameTxt}> {props.name} </Text>
          <TouchableOpacity
            style={styles.cancelContainer}
            onPress={props.cancel}
          >
            {ICONS.entypo("dot-single", null, 17)}
            <Text>{t("Cancel")}</Text>
          </TouchableOpacity>
        </View>
      )}
      <View
        style={
          props.isReplying
            ? styles.replyingFooter
            : [styles.footer, { marginBottom: keyboardStatus ? 10 : 10 }]
        }
      >
        <View style={styles.inputContainer}>
          <TextInput
            autoCorrect={false}
            ref={props.inputRef}
            value={props.myNewComment}
            onChangeText={props.setMyNewComment}
            style={styles.txtInput}
            multiline
            numberOfLines={2}
            onSubmitEditing={() => console.log("enter press")}
            placeholder={props.placeholder}
            autoFocus={true} // Add this line to open the keyboard automatically
          />
        </View>
        <TouchableOpacity onPress={() => props.chooseImageGallery()}>
          <FontAwesome5Icon name="camera" size={25} color={COLORS.primary} />
        </TouchableOpacity>
        {props.myNewComment || props.image ? (
          <TouchableOpacity onPress={() => props.submitNewComment()}>
            <FontAwesome5Icon
              name="paper-plane"
              size={25}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 10,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: COLORS.cocoGrey,
    flexDirection: "row",
    marginTop: getHeight(4),
    marginBottom: getHeight(2),
  },
  replyingFooter: {
    paddingHorizontal: 10,
    backgroundColor: "white",
    left: 0,
    right: 0,
    marginBottom: getHeight(2),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: COLORS.cocoGrey,
    flexDirection: "row",
  },
  txtInput: {
    backgroundColor: COLORS.cocoGrey,
    borderRadius: 10,
    paddingHorizontal: getWidth(2),
    paddingTop: getHeight(1.5),
    paddingBottom: getHeight(1.5),
    marginVertical: getHeight(1),
    textAlignVertical: "center",
  },
  isReplyingContainer: {
    height: 30,
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 20,
  },
  nameTxt: { fontWeight: "bold" },
  cancelContainer: { flexDirection: "row", justifyContent: "center" },
  inputContainer: {
    flex: 0.8,
    maxHeight: getHeight(15),
  },
});

export default memo(TextInputForComments);
