import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  TextInput,
} from "react-native";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ICONS } from "../../Constants/Icons";
import { useTranslation } from "react-i18next";
import { COLORS } from "../../Constants/Colors";
import { HP, WP } from "../../../Utils/Resposive";
import { settingsApiCall } from "../../Services/Apis";
import { getWidth } from "../../../Utils/NewResponsive";
import { showMessage } from "react-native-flash-message";
import { fetchSinglePost } from "../../Redux/actions/NewsFeedActions";
import { postApiCall } from "../../Screens/Main/ReminderScreen/Components/remindersApiCall";

const SavePostFeed = ({
  data,
  group,
  setData,
  savePost,
  fetchUri,
  isModalVisible,
  setLoadingFetch,
  fromNotifications,
  setIsSavePostModalVisible,
}) => {
  const token = useSelector((state) => state?.auth?.userToken);
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const [lastPage, setLastPage] = useState();
  const [loading, setLoading] = useState(false);
  const [collections, setCollections] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(1);
  const [keyboardStatus, setKeyboardStatus] = useState("");
  const [createNewCollection, setCreateNewCollection] = useState(false);
  const [createCollectionLoading, setCreateCollectionLoading] = useState(false);

  const trimCollectionCondition = text.trim();

  const disabledCondition =
    (createNewCollection && trimCollectionCondition?.length < 3) ||
    errorMessage?.length > 0;

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

  useEffect(() => {
    getCollectionsReq();
  }, [page]);

  const getCollectionsReq = async () => {
    if (page === 1) {
      setLoading(true);
    }

    try {
      const res = await settingsApiCall({
        route: `collections?page=${page}`,
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        // Handle error case
      } else if (res.responseCode === 200) {
        setLastPage(res?.payload?.data?.collections?.last_page);
        let newCollections = res?.payload?.data?.collections?.data;

        setCollections((prevCollections) => [
          ...prevCollections,
          ...newCollections,
        ]);

        if (page === 1) {
          setSelectedFolder(newCollections[0]);
        }
      }
      setLoadingMore(false);
    } catch (error) {
      console.log("saga loadStories error -- ", error.toString());
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleEndReached = useCallback(() => {
    if (page < lastPage) {
      setLoadingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  }, [page, lastPage]);

  const onPresSelectedFolder = async (item) => {
    setSelectedFolder(item);
  };

  const onPressYes = async () => {
    setCreateCollectionLoading(true);
    let collectionId = selectedFolder?.encrypted_id;
    let postId = savePost?.encrypted_id;
    const formData = new FormData();
    let apiRoute;

    if (createNewCollection) {
      apiRoute = `collections/post`;
      formData.append("title", text);
      formData.append("post_id", postId);
    } else {
      formData.append("post_id", postId);
      formData.append("collection_id", collectionId);
      apiRoute = `collections/post`;
    }

    const savePosts = await postApiCall(apiRoute, formData, token);

    if (savePosts?.responseCode === 200) {
      setIsSavePostModalVisible(false);
      setCreateCollectionLoading(false);
      showMessage({
        message: t(`${savePosts?.message}`),
        type: "info",
        position: "bottom",
      });

      const newSavedPost = {
        encrypted_id: savePosts?.payload?.data?.collection_id,
      };
      if (group) {
        const updatedData = data.map((item) => {
          if (item?.singlePost?.data?.[0]?.encrypted_id === postId) {
            return {
              ...item,
              singlePost: {
                ...item.singlePost,
                data: [
                  {
                    ...item.singlePost.data[0],
                    saved_post: [newSavedPost],
                  },
                ],
              },
            };
          }
          return item;
        });

        setData(updatedData);
      } else {
        const updatedData = data.map((item) => {
          if (item?.encrypted_id === postId) {
            return {
              ...item,
              saved_post: [newSavedPost],
            };
          }
          return item;
        });
        setData(updatedData);
      }

      if (fromNotifications) {
        dispatch(
          fetchSinglePost({
            token,
            url: fetchUri,
            setLoading: setLoadingFetch,
          })
        );
      }
    } else {
      setCreateCollectionLoading(false);
      setErrorMessage(
        savePosts?.message || "An error occurred. Please try again."
      );
    }
  };

  const onPressCreateNew = useCallback(() => {
    setCreateNewCollection(true);
  }, []);

  const onPressCross = useCallback(() => {
    setCreateNewCollection(false);
  }, []);

  const renderFooter = useMemo(() => {
    return (
      <View style={styles.footerContainer}>
        {loadingMore && <ActivityIndicator color="red" size={"large"} />}
      </View>
    );
  }, [loadingMore]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => onPresSelectedFolder(item)}
    >
      <Text numberOfLines={1} style={styles.label}>
        {item?.title}
      </Text>
      <View style={styles.radioCircle}>
        {selectedFolder?.id === item?.id && <View style={styles.selectedRb} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.centeredView}>
      <Modal
        isVisible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View
          style={[
            styles.outerModalContainer,
            {
              height: keyboardStatus
                ? Platform.OS == "android"
                  ? HP(68)
                  : HP(95)
                : HP(95),
            },
          ]}
        >
          <View style={styles.innerModalContainer}>
            <Text style={styles.titleText}>{t("Save Post")}</Text>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color={COLORS.primary} size="large" />
              </View>
            ) : (
              <>
                {!createNewCollection && (
                  <FlatList
                    data={collections}
                    showsVerticalScrollIndicator={false}
                    renderItem={renderItem}
                    keyExtractor={(item) => item?.id}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderFooter}
                  />
                )}
                <Pressable
                  style={styles.createNewCollectionContainer}
                  onPress={onPressCreateNew}
                >
                  <Text style={styles.createNewText}>{t("Create New")}</Text>
                  {createNewCollection && (
                    <TouchableOpacity onPress={onPressCross}>
                      {ICONS.entypo("cross", COLORS.red, 24)}
                    </TouchableOpacity>
                  )}
                </Pressable>
                {createNewCollection && (
                  <TextInput
                    style={styles.input}
                    placeholder={t("Enter folder name")}
                    placeholderTextColor={COLORS.grey}
                    value={text}
                    onChangeText={(value) => {
                      setText(value);
                      if (errorMessage) setErrorMessage("");
                    }}
                  />
                )}
                <View style={styles.error}>
                  {errorMessage?.length > 0 && createNewCollection && (
                    <Text style={styles.errorText}>{t(errorMessage)}</Text>
                  )}
                  {trimCollectionCondition?.length > 0 &&
                    trimCollectionCondition?.length < 3 &&
                    createNewCollection && (
                      <Text style={styles.errorText}>
                        {t("The title must be at least 3 characters.")}
                      </Text>
                    )}
                </View>

                <View style={styles.modalbuttonStyle}>
                  <TouchableOpacity
                    onPress={() => setIsSavePostModalVisible(false)}
                    style={[
                      styles.button,
                      {
                        borderWidth: 1,
                        borderColor: COLORS.gray,
                      },
                    ]}
                  >
                    <Text style={styles.canText}>{t("Cancel")}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onPressYes}
                    disabled={disabledCondition}
                    style={[
                      styles.button,
                      {
                        backgroundColor: disabledCondition
                          ? COLORS.grey
                          : COLORS.primary,
                      },
                    ]}
                  >
                    {createCollectionLoading ? (
                      <ActivityIndicator size={"small"} color={COLORS.white} />
                    ) : (
                      <Text style={styles.delTxtStyle}>
                        {createNewCollection ? t("Create") : t("Done")}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(SavePostFeed);

const styles = StyleSheet.create({
  outerModalContainer: {
    // flex: 1,
    width: WP(100),
    height: HP(95),
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  innerModalContainer: {
    backgroundColor: COLORS.white,
    alignItems: "center",
    width: WP(95),
    maxHeight: HP(53),
    paddingVertical: 20,
    borderRadius: 30,
    borderWidth: 1,
  },

  modalbuttonStyle: {
    width: getWidth(85),
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    paddingTop: 10,
  },
  button: {
    paddingHorizontal: 10,
    width: WP(25),
    height: HP(6),
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    padding: 10,
    width: getWidth(85),
    marginBottom: 10,
  },
  label: {
    color: COLORS.black,
    fontSize: 18,
    width: "80%",
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.blue,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
  },
  input: {
    height: 100,
    width: WP(85),
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  delTxtStyle: {
    color: COLORS.white,
  },
  titleText: { fontSize: 21, fontWeight: "bold" },
  createNewCollectionContainer: {
    width: getWidth(85),
    top: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  createNewText: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.primary,
  },
  footerContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  error: {
    width: getWidth(95),
    paddingHorizontal: 20,
    marginVertical: 2,
    // height: 20,
  },
  errorText: {
    color: COLORS.primary,
  },
});
