import { useTranslation } from "react-i18next";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import Modal from "react-native-modal";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { getHeight, getWidth } from "../../../Utils/NewResponsive";
import Button from "../NewButton";
import { withoutStringiApiCall2 } from "../../Services/Apis";
import Toast from "react-native-simple-toast";
import DiscardModal from "../DiscardModal";
import { SITE_URL } from "../../Services/Constants";
import { HP, WP } from "../../../Utils/Resposive";
import { IMAGES } from "../../Constants/Images";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";

const SpecificFriends = React.memo((props) => {
  const {
    specificFriends,
    setSpecificFriends,
    setSpecFrndModal,
    specFrndModal,
    setPrivacyPicker,
    editingPost,
    onRefresh = () => {},
  } = props;
  const { t } = useTranslation();
  const [Items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loadingFriendsList, setLoadingFriendsList] = useState(false);

  const [discardModalVisible, setDiscardModalVisible] = useState(false);

  const token = useSelector((state) => state.auth.userToken);
  const userName = useSelector((state) => state.auth.userData.name);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const getFriends = async (val) => {
    setLoadingFriendsList(true);

    try {
      const res = await withoutStringiApiCall2({
        route: `post/specific/users/search?search_friend=${val}`,
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in postgetFriends ... ", res);
        setLoadingFriendsList(false);
      } else if (res.responseCode == 200) {
        if (specificFriends.length) {
          let list = res?.payload?.data?.users;
          const myArrayFiltered = list.filter((el) => {
            return !specificFriends.some((f) => {
              return f.id === el.id;
            });
          });
          setItems(myArrayFiltered);
        } else setItems(res?.payload?.data?.users);

        setLoadingFriendsList(false);
      }
    } catch (e) {
      console.log("Post get Friend error -- ", e.toString());
      setLoadingFriendsList(false);
    }
  };

  useEffect(() => {
    getFriends(inputValue);
  }, [inputValue]);

  const SelectSpecificFriends = async () => {
    specificFriends?.length
      ? setSpecFrndModal(false)
      : Toast.show("Please select a friend");
  };

  const handleOnPressFriendsItem = (item) => {
    if (specificFriends.some((f) => f.id === item.id)) {
      setSpecificFriends(specificFriends.filter((it) => it.id !== item.id));
      setItems([...Items, item]);
    } else {
      setSpecificFriends([...specificFriends, item]);
      setItems(Items.filter((it) => it.id !== item.id));
    }
    inputRef.current.clear();
    inputRef.current.blur();
  };

  const onPressDiscard = () => {
    setPrivacyPicker("public");
    setSpecificFriends([]);
    setDiscardModalVisible(false);
    setSpecFrndModal(false);
  };

  const deleteFromSpecificFriends = (id) => {
    const removedFriend = specificFriends.find((item) => item.id === id);
    setSpecificFriends(specificFriends.filter((item) => item.id !== id));
    setItems([removedFriend, ...Items]);
  };

  return (
    <Modal
      propagateSwipe
      backdropOpacity={0.3}
      isVisible={specFrndModal}
      onBackdropPress={() => {
        setSpecFrndModal(false);
      }}
      swipeDirection={["down"]}
      style={styles.bottomView}
      onRequestClose={() => {
        setSpecFrndModal(false);
      }}
      onSwipeComplete={() => {
        setSpecFrndModal(false);
      }}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{t("Specific Friends")}</Text>
          <TouchableOpacity
            onPress={() => setSpecFrndModal(false)}
            style={{ position: "absolute", right: WP(2) }}
          >
            {ICONS.fontAwesome5("times-circle", COLORS.red, WP(6))}
          </TouchableOpacity>
        </View>
        <View style={{ padding: getHeight(3) }}>
          <>
            <View style={{ maxHeight: HP(20) }}>
              {specificFriends?.length ? (
                <FlatList
                  data={specificFriends}
                  numColumns={2}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{
                        backgroundColor: COLORS.cocoGray,
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 5,
                        borderRadius: 10,
                        marginBottom: 2,
                        marginRight: 2,
                      }}
                      onPress={() => {
                        deleteFromSpecificFriends(item?.id);
                      }}
                    >
                      <Text style={styles.mytext}>
                        {item?.first_name + " " + item?.last_name}
                        {"  "}
                      </Text>
                      {ICONS.fontAwesome5("times-circle", COLORS.red, 14, () =>
                        deleteFromSpecificFriends(item?.id)
                      )}
                    </TouchableOpacity>
                  )}
                />
              ) : null}
              <TextInput
                style={styles.txtInput2}
                ref={inputRef}
                onChangeText={setInputValue}
                placeholder="Search..."
              />
            </View>

            <View style={{ height: getHeight(43), marginTop: 10 }}>
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                style={{ flex: 1 }}
                data={Items}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={() =>
                  loadingFriendsList ? (
                    <View style={styles.listEmptyBox}>
                      <ActivityIndicator
                        animating={true}
                        size="large"
                        color={COLORS.primary}
                      />
                    </View>
                  ) : (
                    <View style={styles.listEmptyBox}>
                      <Text>{t("No Results")}</Text>
                    </View>
                  )
                }
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={index.toString()}
                    onPress={() => {
                      handleOnPressFriendsItem(item);
                    }}
                    style={[styles.box]}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={
                          item?.profile_picture != null
                            ? { uri: SITE_URL + item?.profile_picture }
                            : IMAGES.blankDP
                        }
                        style={styles.friendsDp}
                      />
                      <Text style={{ color: COLORS.black, fontWeight: "bold" }}>
                        {item.first_name + " " + item.last_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </>
        </View>

        <View style={styles.btnmain}>
          <Button
            buttonstyle={styles.btn}
            textstyle={styles.btnText}
            text={t("Cancel")}
            pressFunction={() => {
              if (editingPost) {
                setSpecFrndModal(false);
                return;
              }
              if (specificFriends.length) {
                setDiscardModalVisible(true);
              } else {
                setSpecFrndModal(false);
                setSpecificFriends([]);
                setPrivacyPicker("public");
              }
            }}
          />
          <Button
            buttonstyle={styles.btn}
            textstyle={styles.btnText}
            text={t("Select Friends")}
            pressFunction={() => SelectSpecificFriends()}
          />
        </View>
      </View>
      {discardModalVisible && (
        <DiscardModal
          isVisible={discardModalVisible}
          setIsVisible={setDiscardModalVisible}
          onDiscard={onPressDiscard}
          specificFriends={true}
        />
      )}
    </Modal>
  );
});

export default SpecificFriends;
