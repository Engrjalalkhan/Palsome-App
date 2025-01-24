import { useTranslation } from "react-i18next";
import React, { memo, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";

import { Text } from "react-native";
import { Image } from "react-native";
import Modal from "react-native-modal";
import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";
import { IMAGES } from "../../../../Constants/Images";
import { useDispatch, useSelector } from "react-redux";
import { ACTIONS } from "../../../../Redux/action-types";
import { SITE_URL } from "../../../../Services/Constants";
import { loginRequest } from "../../../../Redux/actions/AuthActions";
import { getHeight, getWidth } from "../../../../../Utils/NewResponsive";
import {
  setMyStory,
  setSideBarFriendList,
} from "../../../../Redux/actions/NewsFeedActions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SwitchUsersModel = memo((props) => {
  const [inactiveUserData, setInactiveUserData] = useState({});

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const userData = useSelector((state) => state.auth.userData);
  const switchUser = useSelector((state) => state.auth.switchUserData);
  const userPasswords = useSelector((state) => state.auth.saveUserPasswords);

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("umar6612");
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("drumar786.66@gmail.com");

  const emailRegex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  useEffect(() => {
    setModalVisible(props.modalVisible);
  }, [props.modalVisible]);

  const closeModal = () => {
    setModalVisible(false);
    props.setModalVisible(false);
  };
  const removeItemValue = async () => {
    try {
      await AsyncStorage.removeItem("fcmtoken");
      return true;
    } catch (exception) {
      return false;
    }
  };
  const handleRemovePreviousFriData = async () => {
    closeModal();
    dispatch(setSideBarFriendList([]));
    removeItemValue();
    dispatch(setMyStory([]));
    dispatch({ type: ACTIONS.CLEAR_LOGIN_RES_ALL });
  };

  const UserLoginFunction = async (item) => {
    // dispatch({ type: ACTIONS.CLEAR_USER_TOKEN });
    const userPassword = userPasswords.find(
      (user) => user?.email === item?.email
    );
    if (userPassword) {
      const params = {
        email: item?.email,
        password: userPassword.password,
        setLoading: setLoading,
        setInactiveUserData: setInactiveUserData,
        userId: userData?.id,
        activeUser: true,
      };
      console.log("loginfun");
      if (email.toLowerCase().match(emailRegex) && password.length > 7) {
        handleRemovePreviousFriData();
        dispatch(loginRequest(params));
        props?.navigation.replace("SwitchUserAnimated", {
          firstName: item?.first_name,
          lastName: item?.last_name,
          profile_picture: item?.profile_picture,
        });
      }
    }
  };

  const uniqueIds = new Set();
  return (
    <View>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={closeModal}
        onSwipeComplete={closeModal}
        swipeDirection={["down"]}
        style={styles.bottomView}
        onRequestClose={closeModal}
        propagateSwipe
      >
        <View style={styles.centerContent}>
          <View style={styles.headLine} />
        </View>
        <View style={[styles.content]}>
          <ScrollView style={styles.scrollContainer}>
            <Pressable>
              {switchUser
                ?.filter((item) => {
                  if (uniqueIds.has(item?.id)) {
                    return false;
                  } else {
                    uniqueIds.add(item?.id);
                    return true;
                  }
                })
                .reverse()
                .map(
                  (item) =>
                    item !== null &&
                    item !== undefined && (
                      <TouchableOpacity
                        disabled={item?.id === userData?.id}
                        style={[styles.switchUserContainer]}
                        onPress={() => {
                          UserLoginFunction(item);
                        }}
                        key={item?.id}
                      >
                        <Image
                          style={styles.userDp}
                          source={
                            item?.profile_picture !== null
                              ? { uri: SITE_URL + item?.profile_picture }
                              : IMAGES.blankDP
                          }
                        />
                        <Text numberOfLines={1} style={[styles.userName]}>
                          {item?.first_name} {item?.last_name}
                        </Text>
                        {item?.id === userData?.id && (
                          <View style={styles.activeUserIcon}>
                            {ICONS.materialCommunityIcons(
                              "account-check",
                              COLORS.white,
                              30,
                              { color: COLORS.primary },
                              props.onPressClose
                            )}
                          </View>
                        )}
                      </TouchableOpacity>
                    )
                )}
            </Pressable>
          </ScrollView>
          <View>
            <TouchableOpacity
              style={styles.addAccountButton}
              onPress={props?.onPress}
            >
              <Text style={styles.addAccountText}>{t("Add Account")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  scrollContainer: {
    maxHeight: getHeight(60),
    marginBottom: 20,
  },
  addAccountButton: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    height: 50,
    justifyContent: "center",
    borderRadius: 10,
    margin: 10,
  },
  addAccountText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "bold",
  },

  content: {
    backgroundColor: COLORS.white,
    padding: 22,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    maxHeight: getHeight(50),
  },

  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottomView: {
    justifyContent: "flex-end",
    margin: 0,
  },
  headLine: {
    height: 6,
    width: 55,
    borderRadius: 5,
    backgroundColor: COLORS.tooLightGrey,
    marginBottom: 5,
  },
  switchUserContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  userDp: { height: 45, width: 45, borderRadius: 125 },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    width: getWidth(58),
    paddingRight: 5,
    textAlign: "left",
  },
  activeUserIcon: {
    position: "absolute",
    left: getWidth(75),
  },
  blurredText: {
    opacity: 0.3,
  },
});

export default SwitchUsersModel;
