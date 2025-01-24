import {
  Text,
  View,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useMemo } from "react";
import AppStyle from "../../../../styles/AppStyle";
import { ICONS } from "../../../../Constants/Icons";
import { COLORS } from "../../../../Constants/Colors";
import { IMAGES } from "../../../../Constants/Images";
import LinearGradient from "react-native-linear-gradient";
import { SITE_URL } from "../../../../Services/Constants";
import { getWidth } from "../../../../../Utils/NewResponsive";
import { textBottomTopContainerSavedStyle } from "../../ReminderScreen/Components/RemindersStyle";

const SavedItemCard = ({
  data,
  onRefresh,
  refreshing,
  headerTitle,
  onPressItem,
  renderFooter,
  loadMoreData,
  onPressThreeDots,
}) => {
  const bottomStyleTop = useMemo(
    () => textBottomTopContainerSavedStyle("top"),
    []
  );
  const bottomStyle = useMemo(
    () => textBottomTopContainerSavedStyle("bottom"),
    []
  );
  const renderItems = ({ item }) => {
    const pages = item?.pages[0]?.page_name;
    const pageCover = item?.pages[0]?.page_picture;
    const sharedColorPost = item?.post_shared;
    const reelThumbNail = item?.post_shared?.media[0]?.thumb_path;
    const sharedPostThumb = item?.post_shared?.media[0]?.path;
    const sharedPosMediaType = item?.post_shared?.media[0]?.post_file_type;
    const sharedPostType = item?.post_shared?.media[0]?.disk;

    const sharedFinalThumb =
      sharedPostType == "processed_reels"
        ? reelThumbNail
        : sharedPosMediaType === "video"
        ? `converted_videos/thumbnails/${item?.post_shared?.media[0]?.thumb_path}`
        : sharedPostThumb;

    const postText = item?.post_text;
    const last_name = item.user?.last_name;
    const first_name = item.user?.first_name;
    const postType = item.post_type;
    const PostUserName =
      postType === "page_post" ? pages : first_name + " " + last_name;
    const profilePic = item.user?.profile_picture;
    const mediaType =
      item?.media?.find((mediaItem) => mediaItem)?.post_file_type || null;
    const thumbnail =
      mediaType !== "video"
        ? item?.media[0]?.path
        : `converted_videos/thumbnails/${item?.media[0]?.thumb_path}`;
    const postUserCover = postType === "page_post" ? pageCover : profilePic;
    const originalThumbnail =
      mediaType === "post"
        ? thumbnail
        : item?.pattern !== null
        ? "frontend/img/" + item?.pattern?.background_image
        : sharedColorPost && sharedColorPost?.pattern !== null
        ? "frontend/img/" + sharedColorPost?.pattern?.background_image
        : postType === "shared_post"
        ? sharedFinalThumb
        : thumbnail;

    const sharedPostText = item?.post_shared?.post_text;

    return (
      <Pressable style={styles.container} onPress={() => onPressItem(item)}>
        {item?.pattern?.background_color_1 == null ? (
          <ImageBackground
            source={
              mediaType === "file"
                ? IMAGES.file
                : originalThumbnail
                ? {
                    uri:
                      mediaType === "post"
                        ? originalThumbnail
                        : sharedPosMediaType === "post"
                        ? originalThumbnail
                        : SITE_URL + originalThumbnail,
                  }
                : IMAGES.blankCover
            }
            style={styles.imageBackground}
          >
            {!originalThumbnail ? (
              <View style={styles.postTextContainer}>
                <Text numberOfLines={1} style={styles.postText}>
                  {postText}
                </Text>
              </View>
            ) : null}
            {item?.pattern || sharedColorPost?.pattern != null ? (
              <View style={styles.postTextContainer}>
                <Text
                  numberOfLines={1}
                  style={[styles.postText, { color: COLORS.white }]}
                >
                  {item?.pattern ? postText : sharedPostText}
                </Text>
              </View>
            ) : null}
            <View style={bottomStyleTop}>
              <Text numberOfLines={1} style={styles.cardNameContainer}>
                {headerTitle ? headerTitle : item?.title}
              </Text>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onPressThreeDots(item)}
              >
                {ICONS.entypo("dots-three-vertical", COLORS.white, 24)}
              </TouchableOpacity>
            </View>
            <View style={bottomStyle}>
              <View style={styles.bottomNameContainer}>
                <TouchableOpacity>
                  <Image
                    source={
                      profilePic
                        ? { uri: SITE_URL + postUserCover }
                        : IMAGES.blankDP
                    }
                    style={styles.userDp}
                  />
                </TouchableOpacity>
                <Text style={[styles.cardNameContainer, { color: "black" }]}>
                  {PostUserName}
                </Text>
              </View>
            </View>
          </ImageBackground>
        ) : (
          <LinearGradient
            colors={[
              item?.pattern?.background_color_1,
              item?.pattern?.background_color_2,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.imageBackground]}
          >
            <View style={styles.postTextContainer}>
              <Text
                style={[styles.postText, { color: item?.pattern?.text_color }]}
              >
                {item.post_text}
              </Text>
            </View>

            <View style={bottomStyleTop}>
              <Text numberOfLines={1} style={styles.cardNameContainer}>
                {headerTitle ? headerTitle : item?.title}
              </Text>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => onPressThreeDots(item)}
              >
                {ICONS.entypo("dots-three-vertical", COLORS.white, 24)}
              </TouchableOpacity>
            </View>
            <View style={bottomStyle}>
              <View style={styles.bottomNameContainer}>
                <TouchableOpacity>
                  <Image
                    source={
                      profilePic
                        ? { uri: SITE_URL + postUserCover }
                        : IMAGES.blankDP
                    }
                    style={styles.userDp}
                  />
                </TouchableOpacity>
                <Text style={[styles.cardNameContainer, { color: "black" }]}>
                  {PostUserName}
                </Text>
              </View>
            </View>
          </LinearGradient>
        )}
      </Pressable>
    );
  };

  return (
    <View style={AppStyle.flex1}>
      <FlatList
        data={data}
        renderItem={renderItems}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item?.id}
        onEndReached={loadMoreData}
        refreshing={refreshing}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      />
    </View>
  );
};

export default React.memo(SavedItemCard);

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    flex: 1,
  },
  imageBackground: {
    height: 300,
    width: getWidth(95),
    resizeMode: "contain",
    justifyContent: "center",
  },
  userDp: {
    height: 35,
    width: 35,
    borderRadius: 125,
    marginRight: 8,
  },
  bottomNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  cardNameContainer: {
    color: "white",
    fontWeight: "bold",
    margin: 10,
    width: "80%",
  },
  iconButton: {
    padding: 5,
    width: 50,
    alignItems: "center",
  },
  postTextContainer: {
    alignItems: "center",
    height: "40%",
    paddingHorizontal: 30,
  },
  postText: {
    fontSize: 30,
    color: COLORS.secondary,
  },
});
