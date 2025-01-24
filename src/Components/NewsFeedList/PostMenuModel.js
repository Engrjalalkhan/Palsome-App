import React, { memo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Modal from "react-native-modal";
import Toast from "react-native-simple-toast";
import SimpleToast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import Clipboard from "@react-native-clipboard/clipboard";

import Button from "../NewButton";
import DiscardModal from "../DiscardModal";

import { HP, WP } from "../../../Utils/Resposive";
import { getHeight, getWidth } from "../../../Utils/NewResponsive";

import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";

import { SHARE_URL } from "../../Services/Constants";
import { withoutStringiApiCall2 } from "../../Services/Apis";
import { updatePost } from "../../Redux/actions/NewsFeedActions";
import { useTranslation } from "react-i18next";
import { isRTL } from "../../../Utils/IsRTL";

const PostMenuModel = memo((props) => {
  const { t } = useTranslation();

  const userId = useSelector((state) => state.auth.userData?.id);

  const {
    postId,
    isAdmin = true,
    isTimeLine = true,
    savePost,
    unSavePost,
    item3,
  } = props;
  const filePost = props?.item3?.media[0]?.post_file_type;

  const postType = item3?.post_type === "ad_post";

  const tagAdmin = props?.item3?.tagged_users?.some((item) => {
    return item.id === userId;
  });

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);

  const [shareModal, setShareModel] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [postOnPickerValue, setPostOnPickerValue] = useState("timeline");

  const [postShareText, setPostShareText] = useState("");
  const [discardModalVisible, setDiscardModalVisible] = useState(false);

  const sharedPostId = props.item3.encrypted_id;

  const delFunction = (removeTag) => {
    setModalVisible(false);
    props?.showConfirmDialog(props.item3.encrypted_id, removeTag);
  };

  const updateShareFunction = () => {
    const { post_type } = props.item3;

    setModalVisible(false);

    setTimeout(() => {
      setShareModel(true);
    }, 1000);

    editSharePost();
  };

  const updateFunction = () => {
    setModalVisible(false);
    props?.editMyPost(props.item3.encrypted_id);
  };

  const editSharePost = async () => {
    const response = await withoutStringiApiCall2({
      route: `shared/post/edit?postId=${sharedPostId}`,
      verb: "GET",
      token: token,
    });

    setPostShareText(response.payload.data.post_text);
  };

  const updateSharePost = async () => {
    setShareModel(false);

    const formData = new FormData();
    formData.append("shared_post_id", JSON.stringify(sharedPostId));
    formData.append(
      "to_edit_post_share_text",
      postShareText !== null ? postShareText : ""
    );

    const response = await withoutStringiApiCall2({
      params: formData,
      route: "shared/post/update",
      verb: "POST",
      token: token,
    });

    dispatch(
      updatePost({
        formData: formData,
        token,
        id: postShareText?.post?.encrypted_id,
      })
    );

    Toast.show(t("uploading...."));
    return response;
  };

  const onPressDiscard = () => {
    setPostShareText(postShareText);
    setPostOnPickerValue("timeline");
    setDiscardModalVisible(false);
    setShareModel(false);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const linkCopied = () => {
    let url = `${SHARE_URL}/en/news_feed/post/${props.item3.encrypted_id}`;

    Clipboard.setString(url);
    SimpleToast.show(t("Link copied"));
  };

  return (
    <View>
      <TouchableOpacity style={styles.singleIcon} onPress={() => openModal()}>
        {ICONS.entypo("dots-three-horizontal", COLORS.primary, 24)}
      </TouchableOpacity>

      {/* ==========UPDATE SHARE MODAL=========== */}
      <Modal
        propagateSwipe
        avoidKeyboard={postOnPickerValue !== "timeline" ? false : true}
        key={postId}
        backdropOpacity={0.3}
        isVisible={shareModal}
        onBackdropPress={() => {
          postShareText == "" && postOnPickerValue == "timeline"
            ? setShareModel(false)
            : setDiscardModalVisible(true);
        }}
        swipeDirection={["down"]}
        style={styles.bottomView2}
        onRequestClose={() => {
          postShareText == "" && postOnPickerValue == "timeline"
            ? setShareModel(false)
            : setDiscardModalVisible(true);
        }}
        onSwipeComplete={() => {
          postShareText == "" && postOnPickerValue == "timeline"
            ? setShareModel(false)
            : setDiscardModalVisible(true);
        }}
        statusBarTranslucent={postOnPickerValue !== "timeline" ? true : false}
      >
        <View style={styles.content2}>
          <View style={styles.header}>
            <Text style={styles.headerText}>{t("Edit Shared Post")}</Text>
          </View>
          <View style={{ padding: getHeight(3) }}>
            <TextInput
              style={styles.txtInput}
              multiline
              numberOfLines={1}
              value={postShareText}
              require={true}
              onChangeText={(val) => setPostShareText(val)}
              placeholder={
                postShareText == null
                  ? "What's going on? #Hashtag.. @Mention.. Link.."
                  : postShareText
              }
            />
          </View>

          <View style={styles.btnmain}>
            <Button
              buttonstyle={styles.btn}
              textstyle={styles.btnText}
              text={t("Cancel")}
              pressFunction={() => {
                postShareText == "" && postOnPickerValue == "timeline"
                  ? setShareModel(false)
                  : setDiscardModalVisible(true);
              }}
            />
            <Button
              buttonstyle={styles.btn}
              textstyle={styles.btnText}
              text={t("Update")}
              pressFunction={() => updateSharePost()}
            />
          </View>
        </View>
        {discardModalVisible && (
          <DiscardModal
            isVisible={discardModalVisible}
            setIsVisible={setDiscardModalVisible}
            onDiscard={onPressDiscard}
            // onSave={() => goBack()}
          />
        )}
      </Modal>

      {/* ============POST MODAL============ */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection={["down"]}
        style={styles.bottomView}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centerContent}>
          <View style={styles.headLine} />
        </View>
        <View
          style={[
            styles.content,
            {
              height:
                isTimeLine && !isAdmin
                  ? 150
                  : isAdmin
                  ? props?.isProfileCover !== "profile_cover_picture" &&
                    props?.isProfileCover !== "profile_picture" &&
                    !props?.birthday &&
                    filePost !== "file" &&
                    props?.item3?.post_type !== "room_cover_picture_post" &&
                    props?.item3?.post_type !== "group_cover_picture_post"
                    ? 200
                    : 150
                  : tagAdmin
                  ? 150
                  : postType
                  ? 100
                  : 150,
            },
          ]}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", padding: 12 }}
            onPress={() => linkCopied()}
          >
            {ICONS.fontAwesome("copy", COLORS.primary, 24)}
            <Text style={styles.modalText}>{t("Copy Link")}</Text>
          </TouchableOpacity>
          {tagAdmin && (
            <TouchableOpacity
              style={{ flexDirection: "row", padding: 12 }}
              onPress={() => delFunction("removeTag")}
            >
              {ICONS.materialCommunityIcons(
                "account-remove",
                COLORS.primary,
                24
              )}
              <Text style={styles.modalText}>{t("Remove Tag")}</Text>
            </TouchableOpacity>
          )}

          {isAdmin &&
            props?.isProfileCover !== "profile_cover_picture" &&
            filePost !== "file" &&
            props?.isProfileCover !== "profile_picture" &&
            !props?.birthday &&
            props?.item3?.post_type !== "room_cover_picture_post" &&
            props?.item3?.post_type !== "group_cover_picture_post" && (
              <TouchableOpacity
                style={{ flexDirection: "row", padding: 12 }}
                onPress={() => {
                  props?.item3?.post_type === "shared_post"
                    ? updateShareFunction()
                    : updateFunction();
                }}
              >
                {ICONS.antDesign("edit", COLORS.primary, 24)}
                <Text style={styles.modalText}>{t("Edit")}</Text>
              </TouchableOpacity>
            )}
          {isAdmin && (
            <TouchableOpacity
              style={{ flexDirection: "row", padding: 12 }}
              onPress={() => delFunction()}
            >
              {ICONS.antDesign("delete", COLORS.primary, 24)}
              <Text style={styles.modalText}>{t("Delete")}</Text>
            </TouchableOpacity>
          )}
          {isTimeLine && !isAdmin && (
            <TouchableOpacity
              style={{ flexDirection: "row", padding: 12 }}
              onPress={() => delFunction()}
            >
              {ICONS.antDesign("delete", COLORS.primary, 24)}
              <Text style={styles.modalText}>{t("Delete")}</Text>
            </TouchableOpacity>
          )}
          {!postType &&
            (item3?.saved_post?.length > 0 ? (
              <TouchableOpacity
                style={{ flexDirection: "row", padding: 12 }}
                onPress={() => {
                  unSavePost(item3), setModalVisible(false);
                }}
              >
                {ICONS.materialCommunityIcons(
                  "bookmark-off",
                  COLORS.primary,
                  25
                )}
                <Text style={styles.modalText}>{t("Unsave Post")}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ flexDirection: "row", padding: 12 }}
                onPress={() => {
                  savePost(item3), setModalVisible(false);
                }}
              >
                {ICONS.fontAwesome("bookmark", COLORS.primary, 24, { left: 4 })}
                <Text style={styles.modalText}>{" " + t("Save Post")}</Text>
              </TouchableOpacity>
            ))}
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
  Contanier: {
    flex: 1,
  },
  singleIcon: {
    height: 30,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    left: 10,
  },
  ModelContanier: {
    backgroundColor: COLORS.white,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },

  img: {
    height: 40,
    width: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 50,
    borderRadius: 10,

    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.cocoGrey,
  },

  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    backgroundColor: COLORS.white,
    //    borderRadius: 15,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,

    width: "100%",
    height: 200,
  },
  content: {
    backgroundColor: COLORS.white,
    padding: 22,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: 200,
    justifyContent: "space-around",
  },
  modalText: {
    fontSize: 19,
    marginLeft: 13,
    height: isRTL ? 50 : null,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
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

  commentAndName: {
    backgroundColor: COLORS.tooLightGrey,
    marginLeft: 10,
    borderRadius: 10,

    width: WP(75),
    // height: HP(8),
    paddingVertical: 7,
    // paddingHorizontal: 10,
  },
  name: {
    marginLeft: 18,
    fontWeight: "bold",
  },
  comenttxt: {
    marginLeft: 18,
  },

  // =====Style for Update Share Modal=======
  header: {
    borderBottomColor: COLORS.cocoGrey,
    borderBottomWidth: 1,
    height: 50,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: { fontSize: 18, fontWeight: "bold" },
  content2: {
    backgroundColor: COLORS.white,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  textInput: {
    height: 40,
    top: 5,
    width: getWidth(40),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.tooLightGrey,
  },
  text: {
    width: "100%",
    height: 60,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  mytext: { fontSize: 16, fontWeight: "bold" },
  box: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    height: getHeight(7),
    borderBottomWidth: 0.5,
    justifyContent: "space-between",
  },
  bottomView2: {
    justifyContent: "flex-end",
    margin: 0,
  },
  txtInput: {
    minHeight: getHeight(5),
    backgroundColor: COLORS.cocoGrey,
    width: "100%",
    maxHeight: getHeight(20),
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    padding: getWidth(2),
    paddingTop: getWidth(3),
  },
  txtInput2: {
    minHeight: getHeight(5),
    backgroundColor: COLORS.cocoGrey,
    width: "100%",
    top: 5,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 10,
    paddingHorizontal: WP(2),
  },
  pickerView: {
    borderColor: "black",
    justifyContent: "center",
    alignSelf: "center",
    width: WP(90),
    height: HP(8),
    borderRadius: 5,
    // borderColor: "red",
    marginTop: HP(5),
    borderWidth: 0.5,
  },

  picker: {
    backgroundColor: "Gray",
    color: "blue",
    fontFamily: "Ebrima",
    fontSize: 17,
    color: COLORS.primary,
  },
  iosPicker: {
    height: 50,
    flexDirection: "row",
    paddingHorizontal: WP(1),
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: HP(1),
  },
  btn: {
    // width: getWidth(40),
    // height: getHeight(7),
    paddingHorizontal: getHeight(3),
    paddingVertical: getHeight(1.5),
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 5,
  },
  btnText: {
    color: COLORS.white,
    fontSize: getHeight(2),
    fontWeight: "bold",
  },
  btnmain: {
    flexDirection: "row",
    marginBottom: HP(3.5),
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  checkbox: {
    alignSelf: "center",
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: COLORS.white,
  //   padding: 10,
  // },
  titleText: {
    padding: 8,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  headingText: {
    padding: 8,
  },
  friendsDp: {
    height: WP(10),
    width: WP(10),
    marginHorizontal: WP(2),
  },
  listEmptyBox: {
    flex: 1,

    height: getHeight(20),
    justifyContent: "center",
    alignItems: "center",
  },
  andrioPicker: {
    // backgroundColor: COLORS.primary,
    width: "100%",
    justifyContent: "center",
    alignContent: "center",

    paddingHorizontal: WP(4),
    // marginRight: HP(3),
    // marginLeft: WP(1),
    // height: HP(3.5),
    // left: WP(3),
    // marginTop: HP(1),
  },
  dropStyle: { width: "80%", height: HP(12) },
});

export default PostMenuModel;
