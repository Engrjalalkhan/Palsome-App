import React, { useState } from "react";
import { memo } from "react";
import { SafeAreaView, StyleSheet, ScrollView, TextInput } from "react-native";
import { getHeight, getWidth } from "../../../Utils/NewResponsive";
import { HP, WP } from "../../../Utils/Resposive";
import { WidthScreen } from "../TopBar/Dimensions";
import { FlatList, View, Text, TouchableOpacity, Image } from "react-native";
import { timeDifference } from "../NewsFeedList/Functions";
import { useDispatch, useSelector } from "react-redux";
import {
  editReply,
  fetchReplies,
  postReply,
  updateReply,
} from "../../Redux/actions/NewsFeedActions";
import { launchImageLibrary } from "react-native-image-picker";
import EditDeleteCommentModal from "../EditDeleteCommentModal";
import { withoutStringiApiCall2 } from "../../Services/Apis";
import Button from "../../Components/NewButton";
import { SITE_URL } from "../../Services/Constants";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";
import { ICONS } from "../../Constants/Icons";

const CommentReplyFlatList2 = memo(({ data, backPress, item3 }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);
  const userName = useSelector((state) => state.auth.userData);

  const [myNewReply, setMyNewReply] = useState("");
  const [replyImage, setReplyImage] = useState("");
  const [editReplyText, setEditReplyText] = useState("");
  const [isEdittingReply, setIsEdittingReply] = useState("");
  const [isEditDellModalReply, setIsEditDellModalReply] = useState(false);
  const [myItemReply, setMyItemReply] = useState(false);

  const editReplyData = useSelector((state) => state.blackNewsF.editReplyData);
  const chooseImageGalleryReply = () => {
    let options = {
      mediaType: "mixed",
      quality: 1,
      noData: true,
      selectionLimit: 6,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled camera picker");
        return;
      } else if (response.errorCode == "camera_unavailable") {
        console.log("Camera not available on device");
        return;
      } else if (response.errorCode == "permission") {
        console.log("Permission not satisfied");
        return;
      } else if (response.errorCode == "others") {
        console.log(response.errorMessage);
        return;
      }
      let uri = response?.assets[0]?.uri;
      let type = response?.assets[0]?.type;
      let name = response?.assets[0]?.fileName;

      const MyObject = { uri, type, name };
      setReplyImage(MyObject);
    });
  };

  const submitNewReplyToServer = async (item) => {
    const formData = new FormData();
    formData.append("comment_text", myNewReply);
    formData.append("post_id", item.post_id);
    formData.append("post_type", "post");
    formData.append("comment_id", item.id);
    {
      replyImage && formData.append("comment_file", replyImage);
    }
    dispatch(postReply({ token, formData }));
  };

  const submitNewReply = async (item) => {
    submitNewReplyToServer(item);
    setReplyImage();
    setMyNewReply("");
  };

  const deleteReply = async (item) => {
    const formData = new FormData();
    formData.append("_js_id", item.id);
    try {
      const res = await withoutStringiApiCall2({
        route: "post/comment/reply/delete",
        verb: "POST",
        token: token,
        params: formData,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 in deleteComment ... ", res);
        setIsEditDellModalReply(false);
      } else if (res.responseCode == 200) {
        setIsEditDellModalReply(false);
        dispatch(
          fetchReplies({
            token,
            id: item3.encrypted_id,
            comm_id: item.comment_id,
          })
        );
      }
    } catch (e) {
      console.log("saga postComment error -- ", e.toString());
    }
  };

  const editMyReply = () => {
    setIsEdittingReply(true);
    setIsEditDellModalReply(false);
    dispatch(editReply({ token, id: myItemReply.id }));
  };

  const updateMyReply = () => {
    const formData = new FormData();
    formData.append("js_comment_form-edit-text", editReplyText);
    formData.append("_js_id", editReplyData.id);
    // {
    //   replyImage && formData.append("comment_file", image);
    // }
    dispatch(updateReply({ token, formData }));
    setIsEdittingReply(false);

    setTimeout(() => {
      dispatch(
        fetchReplies({
          token,
          id: item3.encrypted_id,
          comm_id: myItemReply.comment_id,
        })
      );
    }, 1000);
  };

  React.useEffect(() => {
    if (editReplyData) {
      setEditReplyText(editReplyData.comment_text);
    }
  }, [editReplyData]);
  return (
    <>
      {isEdittingReply ? (
        <SafeAreaView style={styles.containerEdit}>
          <View style={styles.headerEdit}>
            <TouchableOpacity
              onPress={() => {
                setIsEdittingReply(false);
                setEditReplyText("");
              }}
            >
              {ICONS.fontAwesome5("arrow-left", COLORS.black, 30)}
            </TouchableOpacity>
            <Text style={styles.headerTextEdit}>Edit Comment</Text>
          </View>
          <View>
            <TextInput
              value={editReplyText}
              onChangeText={(val) => setEditReplyText(val)}
              style={styles.txtInputEdit}
              multiline
              numberOfLines={7}
              onSubmitEditing={() => console.log("enter press")}
              placeholder=""
            />
            <View style={styles.btnmainEdit}>
              <Button
                buttonstyle={styles.fullbtnEdit}
                textstyle={styles.fullbtnTextEdit}
                text="Cancel"
                pressFunction={() => {
                  setIsEdittingReply(false);
                  setEditReplyText("");
                }}
              />
              <Button
                buttonstyle={styles.fullbtnEdit}
                textstyle={styles.fullbtnTextEdit}
                text="Update"
                pressFunction={() => updateMyReply()}
              />
            </View>
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView
          style={replyImage ? styles.replyContainer : styles.replyContainer2}
        >
          <ScrollView>
            <TouchableOpacity onPress={() => backPress()}>
              {ICONS.fontAwesome5("arrow-left", COLORS.primary, 23, {
                marginLeft: 12,
              })}
            </TouchableOpacity>
            <FlatList
              data={data}
              nestedScrollEnabled
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.flatlistcontainer}
                  >
                    <View style={styles.flatlistInnerCont}>
                      <TouchableOpacity>
                        <Image
                          style={styles.profpic}
                          source={
                            item?.user?.profile_picture != null
                              ? {
                                  uri: SITE_URL + item?.user?.profile_picture,
                                }
                              : IMAGES.blankDP
                          }
                        />
                      </TouchableOpacity>
                      <View>
                        <View style={styles.nameContainer}>
                          <Text style={{ fontWeight: "700" }}>
                            {item.user.first_name + " " + item.user.last_name}
                          </Text>
                          {item.comment_text ? (
                            <Text style={{ fontSize: 16 }}>
                              {item.comment_text}
                            </Text>
                          ) : null}
                          {item.comment_file ? (
                            <Image
                              style={styles.commentPic}
                              source={{
                                uri: SITE_URL + item?.comment_file,
                              }}
                            />
                          ) : null}
                        </View>
                        <View style={styles.reactionsContainer}>
                          <Text>{timeDifference(item.created_at)}</Text>
                          <Text style={{ fontWeight: "700" }}>Like</Text>
                          <Text style={{ fontWeight: "700" }}>Reply</Text>
                          <View style={{ flexDirection: "row" }}>
                            <Text>{item.comment_reactions_count}</Text>
                            {ICONS.fontAwesome5(
                              "thumbs-up",
                              COLORS.primary,
                              16
                            )}
                          </View>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <FlatList
                        data={item.replies}
                        nestedScrollEnabled
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                          return (
                            <View style={styles.flatlistcontainerReplies}>
                              <View style={styles.flatlistInnerCont}>
                                <TouchableOpacity>
                                  <Image
                                    style={styles.profpic}
                                    source={
                                      item?.user?.profile_picture != null
                                        ? {
                                            uri:
                                              SITE_URL +
                                              item?.user?.profile_picture,
                                          }
                                        : IMAGES.blankDP
                                    }
                                  />
                                </TouchableOpacity>
                                <View>
                                  <View style={styles.nameContainer}>
                                    <Text style={{ fontWeight: "700" }}>
                                      {item.user.first_name +
                                        " " +
                                        item.user.last_name}
                                    </Text>
                                    {item.comment_text ? (
                                      <Text style={{ fontSize: 16 }}>
                                        {item.comment_text}
                                      </Text>
                                    ) : null}
                                    {item.comment_file ? (
                                      <Image
                                        style={styles.commentPic}
                                        source={{
                                          uri: SITE_URL + item?.comment_file,
                                        }}
                                      />
                                    ) : null}
                                  </View>
                                  <View style={styles.reactionsContainer}>
                                    <Text>
                                      {timeDifference(item.created_at)}
                                    </Text>
                                    <Text style={{ fontWeight: "700" }}>
                                      Like
                                    </Text>
                                    <Text style={{ fontWeight: "700" }}>
                                      Reply
                                    </Text>
                                    <View style={{ flexDirection: "row" }}>
                                      <Text>
                                        {item.comment_reactions_count}
                                      </Text>
                                      {ICONS.fontAwesome5(
                                        "thumbs-up",
                                        COLORS.primary,
                                        16
                                      )}
                                    </View>
                                  </View>
                                </View>
                              </View>
                              {userName.name == item.user.name && (
                                <TouchableOpacity
                                  onPress={() => {
                                    setIsEditDellModalReply(
                                      !isEditDellModalReply
                                    );
                                    setMyItemReply(item);
                                  }}
                                >
                                  {ICONS.fontAwesome5(
                                    "ellipsis-h",
                                    COLORS.primary,
                                    25
                                  )}
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            <EditDeleteCommentModal
              isEditDellModal={isEditDellModalReply}
              setIsEditDellModal={() => {
                setIsEditDellModalReply(false);
              }}
              closePress={() => setIsEditDellModalReply(false)}
              onPressDell={() => deleteReply(myItemReply)}
              onPressEdit={() => editMyReply()}
            />
          </ScrollView>
        </SafeAreaView>
      )}
      <View>
        {replyImage ? (
          <View style={styles.imgContainer}>
            <Image
              resizeMode="cover"
              style={styles.img}
              source={{ uri: replyImage.uri }}
            />
            <TouchableOpacity onPress={() => setReplyImage()}>
              {ICONS.fontAwesome5("times-circle", COLORS.primary, 25)}
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      {!isEdittingReply ? (
        <View style={styles.footer}>
          <TextInput
            value={myNewReply}
            onChangeText={setMyNewReply}
            style={styles.txtInput}
            multiline
            numberOfLines={2}
            onSubmitEditing={() => console.log("enter press")}
            placeholder="Write a comment there"
          />
          <TouchableOpacity onPress={() => chooseImageGalleryReply()}>
            {ICONS.fontAwesome5("camera", COLORS.primary, 25)}
          </TouchableOpacity>
          {myNewReply || replyImage ? (
            <TouchableOpacity onPress={() => submitNewReply(data[0])}>
              {ICONS.fontAwesome5("paper-plane", COLORS.primary, 25)}
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </>
  );
});
const styles = StyleSheet.create({
  replyContainer: {
    height: getHeight(45),
  },
  replyContainer2: {
    height: getHeight(67),
  },
  profpic: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },
  flatlistcontainer: {
    marginHorizontal: 10,
    marginVertical: 7,
  },
  flatlistcontainerReplies: {
    flexDirection: "row",
    marginHorizontal: 30,
    marginVertical: 1,
  },
  flatlistInnerCont: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 7,
  },
  nameContainer: {
    backgroundColor: COLORS.cocoGray,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
  },
  commentPic: {
    width: 200,
    margin: 5,
    height: 300,
    alignSelf: "center",
  },
  reactionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  footer: {
    alignItems: "center",
    paddingTop: 10,
    justifyContent: "space-around",
    backgroundColor: COLORS.white,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: COLORS.cocoGray,
  },
  txtInput: {
    height: 40,
    backgroundColor: COLORS.cocoGray,
    width: "80%",
    borderRadius: 20,
  },
  imgContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
    height: 150,
    width: WidthScreen,
    justifyContent: "flex-start",
    borderRadius: 10,
    paddingLeft: 10,
    flexDirection: "row",
  },
  img: {
    height: 130,
    width: 100,
    borderWidth: 1,
    borderRadius: 20,
    alignSelf: "center",
  },
  containerEdit: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerEdit: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    alignItems: "center",
    height: getHeight(7),
    marginBottom: getHeight(2),
    borderBottomWidth: 0.5,
  },
  imgEdit: {
    height: getHeight(30),
    width: getWidth(35),
    left: getWidth(4),
    top: getHeight(3),
    borderRadius: 10,
  },
  txtInputEdit: {
    backgroundColor: COLORS.cocoGray,
    width: "95%",
    height: "30%",
    maxHeight: getHeight(30),
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 20,
  },
  headerTextEdit: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 18,
    left: getWidth(25),
  },
  fullbtnEdit: {
    width: getWidth(20),
    height: getHeight(5),
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 5,
    marginRight: 5,
  },
  fullbtnTextEdit: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  btnmainEdit: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: getWidth(3),
    marginTop: getHeight(1.5),
  },
});

export default CommentReplyFlatList2;
