import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { View, Text } from "react-native";
import Modal from "react-native-modal";

import { HP, WP } from "../../../Utils/Resposive";
import Button from "../NewButton";
import { getHeight, getWidth } from "../../../Utils/NewResponsive";
import CheckBox from "@react-native-community/checkbox";
import { withoutStringiApiCall2 } from "../../Services/Apis";
import { useSelector } from "react-redux";
import Toast from "react-native-simple-toast";
import { COLORS } from "../../Constants/Colors";
import { useTranslation } from "react-i18next";

const FriendPrivacySettingModal = (props) => {
  const { t } = useTranslation();

  const { isModal, setIsModal, userId, onClose } = props;
  const token = useSelector((state) => state.auth.userToken);
  const [loadingPrivacySettings, setLoadingPrivacySettings] = useState(false);
  const [wantToSeePrivacy, setWantToSeePrivacy] = useState({
    All: true,
    religious: true,
    political: true,
    social: true,
    Educational: true,
  });
  const [wantToShowPrivacy, setWantToShowPrivacy] = useState({
    All: true,
    religious: true,
    political: true,
    social: true,
    Educational: true,
  });

  useEffect(() => {
    isModal ? getPrivicySettings(userId) : null;
  }, [isModal]);
  const getPrivicySettings = async (id) => {
    setLoadingPrivacySettings(true);
    try {
      const res = await withoutStringiApiCall2({
        route: `timeline/friend/post_tag_modal?friend_id=${id}`,
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in Friend Request ... ", res);
      } else if (res.responseCode == 200) {
        setWantToSeePrivacy({
          All:
            res?.payload?.data?.arr_friend_post_tag_ids?.[2] &&
            res?.payload?.data?.arr_friend_post_tag_ids?.[3] &&
            res?.payload?.data?.arr_friend_post_tag_ids?.[4] &&
            res?.payload?.data?.arr_friend_post_tag_ids?.[5]
              ? true
              : false,
          religious: res?.payload?.data?.arr_friend_post_tag_ids?.[2]
            ? true
            : false,
          political: res?.payload?.data?.arr_friend_post_tag_ids?.[3]
            ? true
            : false,
          social: res?.payload?.data?.arr_friend_post_tag_ids?.[4]
            ? true
            : false,
          Educational: res?.payload?.data?.arr_friend_post_tag_ids?.[5]
            ? true
            : false,
        });
        setWantToShowPrivacy({
          All:
            res?.payload?.data?.arr_user_friend_post_tag_ids?.[2] &&
            res?.payload?.data?.arr_user_friend_post_tag_ids?.[3] &&
            res?.payload?.data?.arr_user_friend_post_tag_ids?.[4] &&
            res?.payload?.data?.arr_user_friend_post_tag_ids?.[5]
              ? true
              : false,
          religious: res?.payload?.data?.arr_user_friend_post_tag_ids?.[2]
            ? true
            : false,
          political: res?.payload?.data?.arr_user_friend_post_tag_ids?.[3]
            ? true
            : false,
          social: res?.payload?.data?.arr_user_friend_post_tag_ids?.[4]
            ? true
            : false,
          Educational: res?.payload?.data?.arr_user_friend_post_tag_ids?.[5]
            ? true
            : false,
        });
        setLoadingPrivacySettings(false);
      }
    } catch (e) {
      console.log("saga postComment error -- ", e.toString());
    }
  };
  const submitPrivacySettings = async (id, wantToSeeArr, wantToShowArr) => {
    const formData = new FormData();
    formData.append("js_friend_post_tag-user_id", id);

    for (let i = 0; i < wantToSeeArr.length; i++) {
      formData.append(`friend_post_tag[${i}]`, wantToSeeArr[i]);
    }
    for (let i = 0; i < wantToShowArr.length; i++) {
      formData.append(`user_friend_post_tag[${i}]`, wantToShowArr[i]);
    }

    try {
      const res = await withoutStringiApiCall2({
        route: "timeline/friend/post_tag_privacy",
        verb: "POST",
        token: token,
        params: formData,
      });

      if (res.responseCode !== 200) {
        Toast.show(res?.message, Toast.SHORT);
      } else if (res.responseCode == 200) {
        Toast.show(res?.message, Toast.SHORT);
      }
    } catch (e) {
      console.log("saga postPrivacySetting Save error -- ", e.toString());
    }
  };

  const handlePressSave = () => {
    const x = Object.values(wantToSeePrivacy);
    const y = Object.values(wantToShowPrivacy);
    onClose();
    setIsModal(false);

    let wantToSeeArr = [];
    let wantToShowArr = [];
    for (let i = 0; i < x.length; i++) {
      if (x[i] == true) {
        wantToSeeArr.push(i + 1);
      }
      if (y[i] == true) {
        wantToShowArr.push(i + 1);
      }
    }

    submitPrivacySettings(userId, wantToSeeArr, wantToShowArr);
    setIsModal(false);
  };

  const MyCheckBox = ({ value, onValueChange }) => {
    return (
      <CheckBox
        boxType="square"
        tintColor={COLORS.lightGray}
        onTintColor={COLORS.lightGray}
        onCheckColor={COLORS.primary}
        onFillColor={COLORS.white}
        offAnimationType="fade"
        onAnimationType="stroke"
        tintColors={{ true: COLORS.primary }}
        value={value}
        onValueChange={onValueChange}
        style={{ height: WP(6), width: WP(6), marginRight: WP(1) }}
      />
    );
  };
  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={isModal}
      onBackdropPress={() => {
        setIsModal(false), onClose();
      }}
      onSwipeComplete={() => {
        setIsModal(false), onClose();
      }}
      swipeDirection={["down"]}
      style={styles.bottomView}
      onRequestClose={() => {
        setIsModal(false), onClose();
      }}
    >
      <View style={styles.content}>
        <View style={styles.centerContent}>
          <View style={styles.headLine} />
        </View>
        <View style={styles.mainContaner}>
          <View style={styles.innerContaner}>
            <View style={[styles.side, { borderRightWidth: 0.3 }]}>
              <Text style={styles.subHeading}>{t("Post you want to see")}</Text>
              {loadingPrivacySettings ? (
                <ActivityIndicator
                  size={"small"}
                  color={COLORS.primary}
                  style={{ flex: 1 }}
                />
              ) : (
                <View style={styles.list}>
                  <View style={styles.listItem}>
                    <MyCheckBox
                      value={wantToSeePrivacy.All}
                      onValueChange={(i) =>
                        setWantToSeePrivacy({
                          All: i,
                          religious: i,
                          political: i,
                          social: i,
                          Educational: i,
                        })
                      }
                    />
                    <Text>{t("Select all")}</Text>
                  </View>
                  <View style={styles.listItem}>
                    <MyCheckBox
                      value={wantToSeePrivacy.religious}
                      onValueChange={(i) =>
                        setWantToSeePrivacy({
                          ...wantToSeePrivacy,
                          religious: i,
                          All:
                            i &&
                            wantToSeePrivacy.political &&
                            wantToSeePrivacy.social &&
                            wantToSeePrivacy.Educational
                              ? true
                              : false,
                        })
                      }
                    />
                    <Text>{t("Religious")}</Text>
                  </View>
                  <View style={styles.listItem}>
                    <MyCheckBox
                      value={wantToSeePrivacy.political}
                      onValueChange={(i) =>
                        setWantToSeePrivacy({
                          ...wantToSeePrivacy,
                          political: i,
                          All:
                            i &&
                            wantToSeePrivacy.religious &&
                            wantToSeePrivacy.social &&
                            wantToSeePrivacy.Educational
                              ? true
                              : false,
                        })
                      }
                    />
                    <Text>{t("Political")}</Text>
                  </View>
                  <View style={styles.listItem}>
                    <MyCheckBox
                      value={wantToSeePrivacy.social}
                      onValueChange={(i) =>
                        setWantToSeePrivacy({
                          ...wantToSeePrivacy,
                          social: i,
                          All:
                            i &&
                            wantToSeePrivacy.religious &&
                            wantToSeePrivacy.political &&
                            wantToSeePrivacy.Educational
                              ? true
                              : false,
                        })
                      }
                    />
                    <Text>{t("Social")}</Text>
                  </View>
                  <View style={styles.listItem}>
                    <MyCheckBox
                      value={wantToSeePrivacy.Educational}
                      onValueChange={(i) =>
                        setWantToSeePrivacy({
                          ...wantToSeePrivacy,
                          Educational: i,
                          All:
                            i &&
                            wantToSeePrivacy.religious &&
                            wantToSeePrivacy.political &&
                            wantToSeePrivacy.social
                              ? true
                              : false,
                        })
                      }
                    />
                    <Text>{t("Educational")}</Text>
                  </View>
                </View>
              )}
            </View>
            <View style={styles.side}>
              <Text style={styles.subHeading}>
                {t("Post you want to show")}
              </Text>
              {loadingPrivacySettings ? (
                <ActivityIndicator
                  size={"small"}
                  color={COLORS.primary}
                  style={{ flex: 1 }}
                />
              ) : (
                <View style={styles.list}>
                  <View style={styles.listItem}>
                    <MyCheckBox
                      value={wantToShowPrivacy.All}
                      onValueChange={(i) =>
                        setWantToShowPrivacy({
                          All: i,
                          religious: i,
                          political: i,
                          social: i,
                          Educational: i,
                        })
                      }
                    />
                    <Text>{t("Select all")}</Text>
                  </View>
                  <View style={styles.listItem}>
                    <MyCheckBox
                      value={wantToShowPrivacy.religious}
                      onValueChange={(i) =>
                        setWantToShowPrivacy({
                          ...wantToShowPrivacy,
                          religious: i,
                          All:
                            i &&
                            wantToShowPrivacy.political &&
                            wantToShowPrivacy.social &&
                            wantToShowPrivacy.Educational
                              ? true
                              : false,
                        })
                      }
                    />
                    <Text>{t("Religious")}</Text>
                  </View>
                  <View style={styles.listItem}>
                    <MyCheckBox
                      value={wantToShowPrivacy.political}
                      onValueChange={(i) =>
                        setWantToShowPrivacy({
                          ...wantToShowPrivacy,
                          political: i,
                          All:
                            i &&
                            wantToShowPrivacy.religious &&
                            wantToShowPrivacy.social &&
                            wantToShowPrivacy.Educational
                              ? true
                              : false,
                        })
                      }
                    />
                    <Text>{t("Political")}</Text>
                  </View>
                  <View style={styles.listItem}>
                    <MyCheckBox
                      value={wantToShowPrivacy.social}
                      onValueChange={(i) =>
                        setWantToShowPrivacy({
                          ...wantToShowPrivacy,
                          social: i,
                          All:
                            i &&
                            wantToShowPrivacy.religious &&
                            wantToShowPrivacy.political &&
                            wantToShowPrivacy.Educational
                              ? true
                              : false,
                        })
                      }
                    />
                    <Text>{t("Social")}</Text>
                  </View>
                  <View style={styles.listItem}>
                    <MyCheckBox
                      value={wantToShowPrivacy.Educational}
                      onValueChange={(i) =>
                        setWantToShowPrivacy({
                          ...wantToShowPrivacy,
                          Educational: i,
                          All:
                            i &&
                            wantToShowPrivacy.religious &&
                            wantToShowPrivacy.political &&
                            wantToShowPrivacy.social
                              ? true
                              : false,
                        })
                      }
                    />
                    <Text>{t("Educational")}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
          <View style={styles.footer}>
            {loadingPrivacySettings ? null : (
              <>
                <Button
                  text={t("Save")}
                  buttonstyle={styles.btn}
                  textstyle={styles.btnText}
                  pressFunction={handlePressSave}
                />
                <Button
                  text={t("Skip")}
                  buttonstyle={styles.btn}
                  textstyle={styles.btnText}
                  pressFunction={() => {
                    setIsModal(false), onClose();
                  }}
                />
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  Contanier: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 0.5,
    justifyContent: "center",
    alignItems: "center",
    height: getHeight(6.2),
  },
  headerHeading: { fontWeight: "600", fontSize: 16 },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  bottomView: {
    justifyContent: "flex-end",
    margin: 0,
    flex: 1,
  },
  headLine: {
    height: 6,
    width: getWidth(20),
    borderRadius: 5,
    backgroundColor: COLORS.primary,

    marginTop: getHeight(2),
  },
  content: {
    backgroundColor: COLORS.white,

    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: getHeight(52),
  },
  btn: {
    width: getWidth(30),
    height: getHeight(5),
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 14,
  },
  mainContaner: { flex: 1, padding: getHeight(2) },
  innerContaner: {
    flex: 1,
    backgroundColor: "aliceblue",
    flexDirection: "row",
  },
  subHeading: { fontWeight: "bold", paddingTop: 8 },
  list: { flex: 1, justifyContent: "space-around" },
  listItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  side: {
    flex: 1,
    alignItems: "center",
  },
  footer: {
    height: getHeight(10),

    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
  },
});

export default React.memo(FriendPrivacySettingModal);
