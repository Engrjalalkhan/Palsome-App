import { useTranslation } from "react-i18next";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Keyboard,
  Platform,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";

import Modal from "react-native-modal";

import { HP, WP } from "../../../../Utils/Resposive";

import { ICONS } from "../../../Constants/Icons";
import { COLORS } from "../../../Constants/Colors";
import { showMessage } from "react-native-flash-message";
import CustomSwitch from "./ToggelButton";

const MessageInput = ({
  onSend,
  disabled,
  isEnabled,
  setIsEnabled,
  aiImageLimit,
}) => {
  const inputRef = useRef();
  const { t } = useTranslation();

  const [message, setMessage] = useState("");
  const [showExpand, setShowExpand] = useState(false);
  const [fullHeight, setFullHeight] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

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

      setMessage("");
    };
  }, []);

  const handleMessageChange = (text) => setMessage(text);

  const layoutEvent = ({ nativeEvent }) => {
    const showbtn = nativeEvent.layout.height >= 80;

    if (showbtn) setShowExpand(true);
    else setShowExpand(false);
  };

  const handleExpand = () => setFullHeight(true);
  const handleShrink = () => setFullHeight(false);

  const handleMessageSend = () => {
    Keyboard.dismiss();
    if (disabled) {
      showMessage({
        message: t("Please wait before sending another message..."),
        type: "info",
        position: "top",
      });

      return;
    }

    handleShrink();

    onSend(message);
    setMessage("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS == "ios" ? "padding" : null}
    >
      <View
        style={[
          styles.inputWrapper,
          { width: message?.trim() == "" ? WP(71) : WP(62) },
        ]}
      >
        <TextInput
          multiline
          ref={inputRef}
          value={message}
          autoCorrect={false}
          spellCheck={false}
          style={styles.input}
          placeholder={t("Write a message")}
          onChangeText={handleMessageChange}
          placeholderTextColor={COLORS.grey}
          onLayout={layoutEvent}
        />
      </View>
      <CustomSwitch
        isEnabled={isEnabled}
        toggleSwitch={toggleSwitch}
        aiImageLimit={aiImageLimit}
        setIsEnabled={setIsEnabled}
      />
      <View>
        {showExpand &&
          ICONS.fontAwesome(
            "expand",
            COLORS.black,
            25,
            styles.icon,
            handleExpand
          )}

        {message.trim() == ""
          ? null
          : ICONS.fontAwesome5(
              "paper-plane",
              COLORS.black,
              25,
              styles.icon,
              handleMessageSend
            )}
      </View>

      <Modal
        avoidKeyboard
        isVisible={fullHeight}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.modal}
        onSwipeComplete={handleShrink}
        swipeDirection="down"
        propagateSwipe
      >
        <SafeAreaView style={styles.modalContentContainer}>
          <View style={styles.fullHeightContainer}>
            <TextInput
              multiline
              autoFocus
              ref={inputRef}
              value={message}
              placeholder={t("Write a message")}
              style={styles.fullHeightInput}
              onChangeText={handleMessageChange}
              placeholderTextColor={COLORS.black}
            />

            <View style={styles.fullHeightButtonsContainer}>
              {ICONS.antDesign(
                "shrink",
                COLORS.black,
                25,
                styles.icon,
                handleShrink
              )}

              {message.trim() == ""
                ? null
                : ICONS.fontAwesome5(
                    "paper-plane",
                    COLORS.black,
                    25,
                    styles.icon,
                    handleMessageSend
                  )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default MessageInput;

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    marginBottom: WP(2),
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: WP(5),
    justifyContent: "space-between",
    backgroundColor: COLORS.tooLightGrey,
  },

  inputWrapper: {
    width: WP(80),
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: WP(3),
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.tooLightGrey,
  },

  input: {
    maxHeight: HP(20),
    paddingTop: WP(2),
    color: COLORS.black,
    paddingVertical: WP(2),
    paddingHorizontal: WP(2),
  },

  icon: {
    marginVertical: HP(1),
  },

  modal: {
    marginBottom: 0,
    marginTop: HP(5),
    marginHorizontal: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: COLORS.tooLightGrey,
  },

  modalContentContainer: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  fullHeightContainer: {
    height: "100%",
    paddingRight: WP(5),
    alignItems: "center",
    flexDirection: "row",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "space-between",
  },

  fullHeightInput: {
    width: WP(85),
    height: "100%",
    padding: WP(5),
    paddingTop: WP(5),
    color: COLORS.black,
    textAlignVertical: "top",
  },

  fullHeightButtonsContainer: {
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
