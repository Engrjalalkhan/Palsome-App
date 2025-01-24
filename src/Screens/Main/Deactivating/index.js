import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MyHeader from "../../../Components/MyHeader";
import { HP } from "../../../../Utils/Resposive";
import Button from "../../../Components/NewButton";
import { useDispatch, useSelector } from "react-redux";
import { withoutStringiApiCall2 } from "../../../Services/Apis";
import Toast from "react-native-simple-toast";
import LogoutModal from "../../../Components/LogoutModal";
import { ACTIONS } from "../../../Redux/action-types";
import { COLORS } from "../../../Constants/Colors";
import { ScrollView } from "react-native-gesture-handler";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TouchableOpacity } from "react-native";
import { isRTL } from "../../../../Utils/IsRTL";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const Deactivating = ({ navigation }) => {
  const [deactivateAccountPassword, setDeactivateAccountPassword] =
    useState("");
  const [deleteAccountPassword, setDeleteAccountPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const token = useSelector((state) => state?.auth?.userToken);
  const dispatch = useDispatch();

  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const { t } = useTranslation();

  const forDeactivateAndDelete = async () => {
    const formData = new FormData();
    formData.append("password", deleteAccountPassword);
    try {
      const response = await withoutStringiApiCall2({
        params: formData,
        route: "user/delete/account",
        verb: "POST",
        token: token,
        // isFormData: Platform.OS === "ios" ? true : false,
      });
      console.log(response, "RES");
      clearData(response?.message);
    } catch (error) {
      console.log(error, "Error");
      clearData(error);
    }
  };
  const forDeactivate = async () => {
    const formData = new FormData();
    formData.append("password", deactivateAccountPassword);
    try {
      const response = await withoutStringiApiCall2({
        params: formData,
        route: "user/deactivate/account",
        verb: "POST",
        token: token,
        // isFormData: Platform.OS === "ios" ? true : false,
      });
      console.log(response, "RES");
      clearData(response?.message);
    } catch (error) {
      console.log(error, "Error");
      clearData(error);
    }
  };

  const clearData = (message) => {
    Toast.show(message, Toast.SHORT);
    setLoading(false);
    setIsLoading(false);
    setDeleteAccountPassword("");
    setDeactivateAccountPassword("");
    message === "Account deactivated successfully" ||
    message === "Account deleted successfully"
      ? dispatch({ type: ACTIONS.LOGOUT })
      : null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView>
        <ScrollView>
          {deactivateModal && (
            <LogoutModal
              isVisible={deactivateModal}
              message={t("You want to Deactivate your account")}
              messageTextColor={true}
              onSuccess={t("Deactivate")}
              onCancel={t("Cancel")}
              setIsVisible={() => setDeactivateModal(false)}
              onSuccessTextColor={true}
              onYesPress={() => {
                setDeactivateModal(false);
                forDeactivate(false);
              }}
            />
          )}

          {deleteModal && (
            <LogoutModal
              isVisible={deleteModal}
              message={t(
                "You want to delete your account. If you're ready to delete it, click Delete Account. Once you've submitted your account for deletion, you have 30 days to reactivate your account and cancel the deletion. After 30 days, the deletion process will begin, and you won't be able to retrieve any of the content or information you've added."
              )}
              messageTextColor={true}
              onSuccess={t("Delete")}
              onCancel={t("Cancel")}
              setIsVisible={() => setDeleteModal(false)}
              onSuccessTextColor={true}
              onYesPress={() => {
                setDeleteModal(false);
                forDeactivateAndDelete(true);
              }}
            />
          )}

          {/* Header Com */}
          <MyHeader
            goBack={() => navigation.goBack()}
            heading={t("Deactivating & Deletion")}
          />
          <DeactivateAndDeleteCard
            heading={t("Deactivate Account")}
            subHeading={t("This can be temporary.")}
            description={t(
              "Your account will be disabled and your name and photos will be removed from most things you've shared. You'll be able to continue using Messenger."
            )}
            onChangeText={setDeactivateAccountPassword}
            placeholder={t("Your Account Password")}
            button={t("Deactivate")}
            onPress={() =>
              deactivateAccountPassword !== ""
                ? setDeactivateModal(true)
                : alert(t("Please enter your account password"))
            }
            value={deactivateAccountPassword}
            loading={loading}
          />
          <DeactivateAndDeleteCard
            heading={t("Delete Account")}
            subHeading={t("This can be permanent")}
            description={t(
              "Your account will be deleted and When you delete your Palsome account, you won't be able to retrieve the content or information that you've shared on Palsome. Your Messenger and all of your messages will also be deleted."
            )}
            onChangeText={setDeleteAccountPassword}
            placeholder={t("Your Account Password")}
            button={t("Delete")}
            value={deleteAccountPassword}
            onPress={() =>
              deleteAccountPassword !== ""
                ? setDeleteModal(true)
                : alert(t("Please enter your account password"))
            }
            loading={isLoading}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: HP(5),
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 5,
  },
  btnText: {
    color: COLORS.white,
    fontSize: HP(2),
    fontWeight: "bold",
  },
  textInput: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    height: HP(5),
    paddingHorizontal: 10,
    marginTop: 5,
  },
  subHeading: {
    marginVertical: 5,
    fontWeight: "700",
    color: COLORS.gray,
  },
  heading: {
    fontSize: HP(2.2),
    fontWeight: "bold",
  },
  listOfContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  // containerTextInput: {
  //   flexDirection: "row",
  //   alignItems: "center",
  // },
  // textInput: {
  //   flex: 1, // Take up remaining pace
  //   paddingRight: 25,
  // },
  iconContainer: {
    position: "absolute",
    top: HP(1.9),
    right: 9,
  },
});

export default Deactivating;

const DeactivateAndDeleteCard = (item) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    }
  };

  return (
    <View style={styles.listOfContainer}>
      <Text style={styles.heading}>{item?.heading}</Text>
      <Text style={styles.subHeading}>{item?.subHeading}</Text>
      <Text style={styles.description}>{item?.description}</Text>
      {/* <TextInput
        placeholder={item?.placeholder}
        placeholderTextColor={COLORS.grey}
        style={styles.textInput}
        onChangeText={item?.onChangeText}
        value={item?.value}
        autoCapitalize="none"
        secureTextEntry={true}
      ></TextInput> */}
      <View style={styles.containerTextInput}>
        <TextInput
          placeholder={item?.placeholder}
          placeholderTextColor={COLORS.grey}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!showPassword}
          value={item?.value}
          onChangeText={item?.onChangeText}
          style={styles.textInput}
        />
        {item?.value ? (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => {
              togglePasswordVisibility("password");
            }}
          >
            <View>
              <Ionicons
                name={showPassword ? "eye" : "eye-off"}
                size={22}
                color={COLORS.black}
              />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
      <Button
        buttonstyle={styles.btn}
        textstyle={styles.btnText}
        text={item?.button}
        pressFunction={() => item?.onPress()}
        loading={item?.loading}
      />
    </View>
  );
};
