import { useTranslation } from "react-i18next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Alert,
  FlatList,
  Keyboard,
  Platform,
  TextInput,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

import _ from "lodash";
import { franc } from "franc-min";
import moment from "moment/moment";
import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import FastImage from "react-native-fast-image";
import { useSelector, useDispatch } from "react-redux";
import { showMessage } from "react-native-flash-message";
import Clipboard from "@react-native-clipboard/clipboard";
import { TypingAnimation } from "react-native-typing-animation";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import ChatHeader from "./Components/ChatHeader";
import MessageInput from "./Components/MessageInput";
import NewPostModal from "../../Components/NewPostModal";

import { HP, WP } from "../../../Utils/Resposive";
import { settingsApiCall, withoutStringiApiCall } from "../../Services/Apis";

import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import { IMAGES } from "../../Constants/Images";

import { SITE_URL } from "../../Services/Constants";
import { getAllConversations, sendMessage } from "../../Redux/actions/ChatGPT";
import { getHeight, getWidth } from "../../../Utils/NewResponsive";
import { isRTL } from "../../../Utils/IsRTL";
import { useNavigation } from "@react-navigation/native";
import { useBackHandler } from "../../../Utils/backHardwareBackPress/handleHardBackPress";

const SingleConversation = () => {
  const flatlistRef = useRef();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const { allConversations } = useSelector((state) => state.chatGPTRed);

  const token = useSelector((state) => state.auth.userToken);
  const userData = useSelector((state) => state.auth.userData);
  const dpProfile = useSelector((state) => state?.prof?.profilePicture);
  const dpUserData = userData?.profile_picture;

  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [lastpage, setLastpage] = useState(1);
  const [rename, setRename] = useState(false);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState(false);
  const [fromDots, setFromDots] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [longpress, setLongpress] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChat, setSelectedChat] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [visibleIndex, setVisibleIndex] = useState(false);
  const [longpressItem, setLongpressItem] = useState(null);
  const [nextPageLoading, setNextPageLoading] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [aiImageLimit, setAiImageLimit] = useState("");

  const [Placeholder, setPlaceholder] = useState(
    `What's on your mind, ${userData?.first_name}`
  );

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      flatlistRef?.current?.scrollToEnd();
    }, 500);
  }, [messages]);

  const getConversations = async () => {
    const response = await withoutStringiApiCall({
      params: undefined,
      route: `chatGPT/conversations?page=${page}&limit=15`,
      verb: "GET",
      token: token,
    });

    setLoading(false);
    setRefreshing(false);
    setNextPageLoading(false);

    if (response.responseCode !== 200) {
      console.log("response !== 200 ... in get all conversations", response);
    } else if (response.responseCode == 200) {
      setPage((prevState) => prevState + 1);
      setLastpage(response.payload?.conversations?.last_page);

      const convers =
        page == 1
          ? [...response.payload?.conversations?.data]
          : [...allConversations, ...response.payload?.conversations?.data];

      dispatch(getAllConversations(convers));
    }
  };

  const handleNameChange = (text) => setName(text);
  const handleShowDrawer = () => setShowDrawer(true);

  const handleHideDrawer = () => {
    setKeyword("");
    setShowDrawer(false);
    setSearchResult(null);
  };

  const handleHideLongpressModal = () => setLongpress(false);

  const handleShowNewPost = (item) => {
    setLongpressItem(item);
    setNewPost(true);
  };

  const handleHideNewPost = () => {
    setLongpressItem(null);
    setNewPost(false);
  };

  const handleShowLongpressModal = (item) => {
    setKeyword("");
    setSearchResult(null);
    setShowDrawer(false);
    setLongpressItem(item);
    setKeyword("");
    setSearchResult(null);

    setTimeout(() => {
      setLongpress(true);
    }, 500);
  };

  const handleHideRenameModal = () => {
    setName("");
    setRename(false);
  };

  const handleShowRenameModal = () => {
    setLongpress(false);
    setName(longpressItem?.topic);

    setTimeout(() => {
      setRename(true);
    }, 500);
  };

  const onRefresh = useCallback(() => {
    setPage(1);

    setRefreshing(true);
    getConversations();
  }, []);

  useEffect(() => {
    getAiLimit();
  }, []);

  const getAiLimit = async () => {
    const res = await withoutStringiApiCall({
      route: "palsomeAI/limit",
      verb: "GET",
      token: token,
    });

    if (res.responseCode === 200) {
      const aiLimit = res?.payload?.palsome_ai_image_limit_count;
      setAiImageLimit(aiLimit);
    } else {
      setAiImageLimit(0);
    }
  };

  const handleNewConversation = () => {
    setKeyword("");
    setSelectedChat("");
    setMessages([]);
    setTyping(false);
    setSearchResult(null);
    setCurrentConversation(null);
    setKeyword("");
    setSearchResult(null);
    setIsEnabled(false);
    handleHideDrawer();
  };

  const handleConversationPress = async (id) => {
    setKeyword("");
    setLoading(true);
    setSelectedChat(id);
    setSearchResult(null);
    setIsEnabled(false);

    handleHideDrawer();

    const response = await withoutStringiApiCall({
      params: undefined,
      route: `chatGPT/conversation/${id}`,
      verb: "GET",
      token: token,
    });

    setLoading(false);

    if (response.responseCode !== 200) {
      console.log(
        "response !== 200 ... in get conversation messages",
        response
      );
    } else if (response.responseCode == 200) {
      setMessages(response.payload?.messages);
      setCurrentConversation(response.payload?.current_conversation);
      setAiImageLimit(response.payload?.palsome_ai_image_limit_count);
    }
  };

  const handleMessageSend = async (text) => {
    setTyping(true);
    Keyboard.dismiss();
    let newMessages = [...messages];

    newMessages.push({
      message: text.trim(),
      message_from: "user",
    });
    setMessages(newMessages);
    const data = {
      message_type: isEnabled ? "image" : "text",
      // message_type: "text",
      message_body: text.trim(),
      conversation_id: selectedChat == "" ? undefined : selectedChat,
    };

    const response = await settingsApiCall({
      params: data,
      route: `chatGPT/message/send`,
      verb: "POST",
      token: token,
    });

    if (response.responseCode !== 200) {
      console.log(
        "response !== 200 ... in send conversation message",
        response.message
      );

      let newMessages = [...messages];

      setTyping(false);
      setMessages(newMessages);

      showMessage({
        message: response.message,
        type: "danger",
      });
    } else if (response.responseCode == 200) {
      if (isEnabled) {
        if (aiImageLimit > 0) {
          setAiImageLimit((prevLimit) => prevLimit - 1);
        }

        if (aiImageLimit - 1 === 0) {
          setIsEnabled(false);
        }
      }
      let newMessages = [...messages];

      newMessages.push(response.payload?.message);
      newMessages.push(response.payload?.chatgpt_message);

      if (!selectedChat) {
        setCurrentConversation(response.payload.conversation);
        setSelectedChat(response.payload.conversation.encrypted_id);
        dispatch(sendMessage(response.payload.conversation));
      } else {
        let current = { ...currentConversation };
        current.updated_at = response?.payload?.chatgpt_message?.created_at;
        setCurrentConversation(current);

        let convers = [...allConversations];
        let ind = convers.findIndex((el) => el?.id == currentConversation?.id);

        convers.splice(ind, 1);
        convers.unshift(currentConversation);

        dispatch(getAllConversations(convers));
      }

      setTyping(false);
      setMessages(newMessages);
    }
  };

  const handleDeleteConversation = async () => {
    setLoading(true);
    handleHideLongpressModal();

    const response = await withoutStringiApiCall({
      params: undefined,
      route: `chatGPT/conversation/${longpressItem.encrypted_id}`,
      verb: "DELETE",
      token: token,
    });

    setLoading(false);

    if (response.responseCode !== 200) {
      console.log("response !== 200 ... in delete conversation", response);
      showMessage({
        message: "Could not delete, please try again",
        type: "warning",
      });
    } else if (response.responseCode == 200) {
      showMessage({
        message: "Deleted successfully",
        type: "success",
        duration: 2000,
      });

      let convers = [...allConversations];
      const ind = convers.findIndex((el) => el.id == longpressItem.id);

      convers.splice(ind, 1);

      if (longpressItem?.id == currentConversation?.id) {
        setMessages([]);
        setSelectedChat("");
        setCurrentConversation(null);
      }

      setLongpressItem(null);
      dispatch(getAllConversations(convers));

      if (fromDots) {
        setFromDots(false);
      } else {
        setTimeout(() => {
          handleShowDrawer();
        }, 2200);
      }
    }
  };

  const handleDeleteConfirmation = () => {
    Alert.alert(
      t("Are you sure?"),
      t("Are you sure you want to delete this chat?"),
      [
        {
          text: t("Yes"),
          onPress: () => {
            handleDeleteConversation();
          },
        },

        {
          text: t("No"),
        },
      ]
    );
  };

  const handleRenameConversation = async () => {
    setLoading(true);
    handleHideRenameModal();

    const data = { topic: name };

    const response = await settingsApiCall({
      params: data,
      route: `chatGPT/conversation/${longpressItem.encrypted_id}`,
      verb: "POST",
      token: token,
    });

    setName("");
    setLoading(false);

    if (response.responseCode !== 200) {
      console.log("response !== 200 ... in rename conversation", response);
      showMessage({
        message: "Could not change name, please try again",
        type: "warning",
      });
    } else if (response.responseCode == 200) {
      showMessage({
        message: "Name changed successfully",
        type: "success",
        duration: 2000,
      });

      let convers = [...allConversations];
      const ind = convers.findIndex((el) => el.id == longpressItem.id);

      let thisChat = { ...convers[ind] };
      thisChat.topic = name;
      convers[ind] = thisChat;

      setLongpressItem(null);
      dispatch(getAllConversations(convers));

      currentConversation?.id == longpressItem?.id &&
        setCurrentConversation(thisChat);

      if (fromDots) {
        setFromDots(false);
      } else {
        setTimeout(() => {
          handleShowDrawer();
        }, 2200);
      }
    }
  };

  const changePlaceholderString = (text) => {
    if (text) setPlaceholder(text);
    else setPlaceholder(`What's on your mind, ${userData?.first_name}`);
  };

  const handleDownButtonPress = () => {
    setTimeout(() => {
      flatlistRef.current.scrollToEnd();
    }, 500);
  };

  const searchWithDebounce = useCallback(
    _.debounce(
      async (text) => {
        if (text != "") {
          const response = await withoutStringiApiCall({
            params: undefined,
            route: `chatGPT/conversations?term=${text}`,
            verb: "GET",
            token: token,
          });

          setLoading(false);
          setRefreshing(false);

          if (response.responseCode !== 200) {
            console.log(
              "response !== 200 ... in get all conversations",
              response
            );
          } else if (response.responseCode == 200) {
            setSearchResult(response.payload?.conversations?.data);
          }
        } else {
          setSearchResult(null);
        }
      },

      200
    ),
    []
  );

  const handleKeywordChange = async (text) => {
    setKeyword(text);
    searchWithDebounce(text);
  };

  const handleEndReached = () => {
    if (page <= lastpage) {
      setNextPageLoading(true);
      getConversations();
    }
  };

  const copyText = (text) => {
    Clipboard.setString(text);
    Toast.show("Text copied to clipboard", Toast.LONG);
  };

  const renderMessage = ({ item }) => {
    const lang = franc(item?.message);
    const isRTL = ["arb", "urd", "pes", "pbu"].includes(lang);

    const imageSource =
      item.message_from == "ai"
        ? IMAGES.logo
        : dpProfile
        ? { uri: dpProfile }
        : dpUserData
        ? { uri: SITE_URL + dpUserData }
        : IMAGES.blankDP;

    const rtlStyle = Platform.select({
      android: null,
      ios: {
        lineHeight: isRTL ? 32 : undefined,
        textAlign: isRTL ? "right" : "left",
        paddingBottom: isRTL ? 5 : undefined,
      },
    });

    return (
      <View style={styles.messageContainer}>
        <View style={styles.senderInfoWrapper}>
          <View style={styles.senderInfoContainer}>
            <FastImage style={styles.dp} source={imageSource} />
            <Text style={styles.messageTextHeading}>
              {item.message_from == "ai" ? "Palsome AI" : "You"}
            </Text>
          </View>

          <View style={styles.senderInfoContainer}>
            {item?.message_from == "ai" && item?.type !== "image" && (
              <MaterialIcons
                name="content-copy"
                style={styles.clipboardIcon}
                onPress={() => copyText(item?.message)}
              />
            )}

            {item?.message_from == "ai" &&
              ICONS.fontAwesome(
                "share-square-o",
                COLORS.black,
                20,
                { padding: 5 },
                () => handleShowNewPost(item)
              )}
          </View>
        </View>

        <Text style={[styles.messageText, rtlStyle]}>{item?.message}</Text>
        {item?.type === "image" && (
          <Image
            source={{ uri: SITE_URL + item?.image }}
            style={styles.messageImage}
          />
        )}
        <Text style={styles.messageTime}>
          {moment(item?.created_at).format("MM-DD-YYYY hh:mm a")}
        </Text>
      </View>
    );
  };

  const renderConversation = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.conversationContainer}
        onPress={() => handleConversationPress(item?.encrypted_id)}
        onLongPress={() => handleShowLongpressModal(item)}
      >
        <View style={{ width: "90%" }}>
          <Text numberOfLines={2} style={styles.newChatText}>
            {item?.topic}
          </Text>

          <Text style={[styles.messageTime, { textAlign: "left" }]}>
            {moment(item?.updated_at).format("MM-DD-YYYY hh:mm a")}
          </Text>
        </View>

        {ICONS.entypo("dots-three-vertical", COLORS.black, 20, null, () => {
          handleShowLongpressModal(item);
        })}
      </TouchableOpacity>
    );
  };

  const emptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <FastImage source={IMAGES.logo} style={styles.emptyLogo} />
        <Text style={styles.emptyText}>{t("Ask AI")}</Text>
      </View>
    );
  };

  const emptyComponentConversations = () => {
    return (
      <View style={styles.emptyContainer}>
        <FastImage source={IMAGES.logo} style={styles.emptyLogo} />
        <Text style={styles.emptyText}>
          {searchResult?.length == 0
            ? t("No matching conversations found")
            : t("No chat at the moment, start a new one?")}
        </Text>
      </View>
    );
  };

  const debouncedHandleScroll = useCallback(
    _.debounce(
      (event) => {
        const { contentOffset, layoutMeasurement, contentSize } = event;
        const isAtEndY =
          parseInt(contentOffset.y) >=
          parseInt(contentSize.height - layoutMeasurement.height);

        if (isAtEndY) setVisibleIndex(false);
        else setVisibleIndex(true);
      },
      200,
      { leading: true }
    ),
    []
  );

  return loading ? (
    <SafeAreaView style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </SafeAreaView>
  ) : (
    <View style={styles.container}>
      <SafeAreaView style={{ backgroundColor: COLORS.primary }} />

      <ChatHeader
        openDrawer={handleShowDrawer}
        newChatAction={handleNewConversation}
      />

      {currentConversation && (
        <View style={styles.chatNameHeader}>
          <View />

          <Text numberOfLines={1} style={styles.messageTextHeading}>
            {currentConversation?.topic}
          </Text>

          {ICONS.entypo("dots-three-vertical", COLORS.black, 20, null, () => {
            setFromDots(true);
            handleShowLongpressModal({ ...currentConversation });
          })}
        </View>
      )}

      <FlatList
        data={messages}
        ref={flatlistRef}
        extraData={messages}
        renderItem={renderMessage}
        ListEmptyComponent={emptyComponent}
        initialNumToRender={messages.length}
        keyExtractor={(item, index) => index}
        contentContainerStyle={{ paddingHorizontal: WP(2) }}
        ListFooterComponentStyle={{ height: typing ? HP(4) : 0 }}
        ListFooterComponent={() =>
          typing ? (
            <TypingAnimation
              style={styles.messageContainer}
              dotMargin={WP(2)}
              dotX={WP(6)}
            />
          ) : null
        }
        onScroll={(event) => {
          event.persist();
          debouncedHandleScroll(event.nativeEvent);
        }}
      />

      {visibleIndex && (
        <TouchableOpacity
          style={styles.downButton}
          onPress={handleDownButtonPress}
        >
          {ICONS.antDesign("arrowdown", COLORS.white, 25)}
        </TouchableOpacity>
      )}

      <MessageInput
        onSend={handleMessageSend}
        disabled={typing}
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
        aiImageLimit={aiImageLimit}
      />

      <Modal
        hasBackdrop
        propagateSwipe
        style={styles.modal}
        isVisible={showDrawer}
        swipeDirection={isRTL ? "left" : "right"}
        animationIn={isRTL ? "slideInLeft" : "slideInRight"}
        animationOut={isRTL ? "slideOutLeft" : "slideOutRight"}
        onSwipeComplete={handleHideDrawer}
        onBackdropPress={handleHideDrawer}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.newChatContainer}
              onPress={handleNewConversation}
            >
              {ICONS.antDesign("pluscircle", COLORS.white, 25, styles.icon)}
              <Text style={styles.newChatTextHeader}>{t("New Chat")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              value={keyword}
              placeholder={t("Search")}
              style={styles.searchInput}
              placeholderTextColor={COLORS.grey}
              onChangeText={handleKeywordChange}
            />

            {ICONS.ionIcons("search-sharp", COLORS.black, 25)}
          </View>

          <FlatList
            data={searchResult || allConversations}
            renderItem={renderConversation}
            keyExtractor={(item, index) => index}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={emptyComponentConversations}
            contentContainerStyle={{ paddingHorizontal: WP(2) }}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.7}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListFooterComponent={() =>
              nextPageLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : null
            }
          />
        </SafeAreaView>
      </Modal>

      <Modal
        hasBackdrop
        propagateSwipe
        isVisible={longpress}
        swipeDirection="down"
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.longpressModal}
        onSwipeComplete={handleHideLongpressModal}
        onBackdropPress={handleHideLongpressModal}
      >
        <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
          <Text numberOfLines={1} style={styles.renameModalHeadingText}>
            {longpressItem?.topic}
          </Text>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleShowRenameModal}
          >
            <Text style={styles.newChatText}>{t("Rename chat")}</Text>
            {ICONS.fontAwesome("edit", COLORS.black, 25, styles.icon)}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleDeleteConfirmation}
          >
            <Text style={styles.newChatText}>{t("Delete chat")}</Text>
            {ICONS.antDesign("delete", COLORS.black, 25, styles.icon)}
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>

      <Modal
        hasBackdrop
        avoidKeyboard
        propagateSwipe
        isVisible={rename}
        swipeDirection="down"
        animationIn="slideInUp"
        style={styles.renameModal}
        animationOut="slideOutDown"
        onSwipeComplete={handleHideRenameModal}
        onBackdropPress={handleHideRenameModal}
      >
        <TouchableWithoutFeedback
          style={{ flex: 1, justifyContent: "center" }}
          onPress={Keyboard.dismiss}
          accessible={false}
        >
          <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
            <Text numberOfLines={3} style={styles.renameModalHeadingText}>
              {t("Rename chat")}
            </Text>

            <TextInput
              value={name}
              onChangeText={handleNameChange}
              placeholder={t("Rename conversation")}
              placeholderTextColor={COLORS.grey}
              style={styles.nameInput}
            />

            <View style={styles.renameModalButtonsContainer}>
              <TouchableOpacity
                disabled={name == "" ? true : false}
                style={[
                  styles.renameModalButton,
                  {
                    backgroundColor:
                      name == "" ? COLORS.lightGray : COLORS.primary,
                  },
                ]}
                onPress={handleRenameConversation}
              >
                <Text style={styles.renameModalButtonText}>{t("Rename")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.renameModalButton,
                  { backgroundColor: COLORS.white },
                ]}
                onPress={handleHideRenameModal}
              >
                <Text style={styles.renameModalCancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>

      {newPost && (
        <NewPostModal
          textToPost={longpressItem?.message}
          item={longpressItem}
          setItem={setLongpressItem}
          room_encrypted_id={undefined}
          room_id={undefined}
          newsFeed={true}
          room={undefined}
          visible={newPost}
          goBack={handleHideNewPost}
          changePlaceholderString={changePlaceholderString}
          dataOfPostOntimeline={{
            timelinePlaceholder: undefined,
            encrypted_id: undefined,
          }}
        />
      )}

      <SafeAreaView />
    </View>
  );
};

export default SingleConversation;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingLogo: {
    width: WP(30),
    height: WP(30),
    borderRadius: 50,
  },

  container: {
    flex: 1,
  },

  chatNameHeader: {
    padding: WP(3),
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    marginVertical: WP(1),
    marginHorizontal: WP(2),
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
  },

  messageContainer: {
    elevation: 5,
    padding: WP(3),
    borderRadius: 5,
    marginVertical: WP(1),
    backgroundColor: COLORS.white,
  },

  messageTextHeading: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },

  messageText: {
    fontSize: 16,
    color: COLORS.black,
  },
  messageImage: {
    height: getHeight(42),
    resizeMode: "contain",
  },

  messageTime: {
    fontSize: 12,
    marginTop: HP(2),
    color: COLORS.black,
    textAlign: "right",
  },

  senderInfoWrapper: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: HP(1.5),
    justifyContent: "space-between",
  },

  senderInfoContainer: {
    alignItems: "center",
    flexDirection: "row",
  },

  dp: {
    width: WP(7.5),
    height: WP(7.5),
    borderRadius: 50,
    marginRight: WP(3),
  },

  clipboardIcon: {
    padding: 5,
    fontSize: 20,
    color: COLORS.black,
  },

  emptyContainer: {
    height: HP(75),
    alignItems: "center",
    justifyContent: "center",
  },

  emptyLogo: {
    width: WP(25),
    height: WP(25),
    borderRadius: 50,
  },

  emptyText: {
    fontSize: 22,
    marginTop: HP(2),
    color: COLORS.grey,
    textAlign: "center",
  },

  downButton: {
    zIndex: 1,
    right: WP(3),
    width: WP(10),
    bottom: HP(10),
    height: WP(10),
    borderRadius: 50,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },

  modal: {
    margin: 0,
    width: WP(75),
    alignSelf: "flex-end",
    backgroundColor: COLORS.tooLightGrey,
  },

  modalHeader: {
    padding: WP(3),
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    justifyContent: "space-between",
    backgroundColor: COLORS.primary,
    borderBottomColor: COLORS.lightGray,
  },

  newChatContainer: {
    alignItems: "center",
    flexDirection: "row",
  },

  icon: {
    marginRight: WP(2),
  },

  newChatTextHeader: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.white,
  },

  newChatText: {
    width: "90%",
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.black,
  },

  conversationContainer: {
    padding: WP(3),
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    marginVertical: HP(1),
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
  },

  searchContainer: {
    borderRadius: 5,
    paddingRight: WP(3),
    alignItems: "center",
    flexDirection: "row",
    marginVertical: HP(1),
    marginHorizontal: WP(2),
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
  },

  searchInput: {
    width: "87%",
    padding: WP(3),
  },

  longpressModal: {
    margin: 0,
    marginTop: HP(72),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "center",
    backgroundColor: COLORS.tooLightGrey,
  },

  buttonContainer: {
    margin: WP(2),
    padding: WP(3),
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.white,
    justifyContent: "space-between",
  },

  renameModal: {
    margin: 0,
    marginTop: HP(10),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "center",
    backgroundColor: COLORS.tooLightGrey,
  },

  renameModalHeadingText: {
    width: "80%",
    fontSize: 22,
    fontWeight: "400",
    color: COLORS.black,
    textAlign: "center",
    alignSelf: "center",
    marginVertical: HP(1),
  },

  nameInput: {
    margin: HP(2),
    padding: WP(3),
    borderWidth: 1,
    borderRadius: 25,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },

  renameModalButtonsContainer: {
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  renameModalButton: {
    width: WP(25),
    margin: WP(2),
    padding: WP(3),
    borderRadius: 5,
    alignSelf: "center",
    alignItems: "center",
    marginHorizontal: WP(5),
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },

  renameModalButtonText: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.white,
  },

  renameModalCancelButtonText: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.black,
  },
});
