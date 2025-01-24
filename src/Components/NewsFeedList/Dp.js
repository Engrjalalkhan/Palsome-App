import React, { useState } from "react";
import { useSelector } from "react-redux";

import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity, StyleSheet } from "react-native";

import FastImage from "react-native-fast-image";
import { COLORS } from "../../Constants/Colors";
import { IMAGES } from "../../Constants/Images";
import { SITE_URL } from "../../Services/Constants";
import SimpleToast from "react-native-simple-toast";
import { getBorderStyle } from "../../../Utils/GetBorderStyle";
import { getOpenUserStory } from "../../../Utils/OpenUserStory";
import StoryModel from "../Stories/InstaStory/src/components/StoryModel";

const Dp = ({ user, pages, groups, events, rooms, shared_page_post }) => {
  const navigation = useNavigation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUserStories, setCurrentUserStories] = useState([]);

  const userData = useSelector((state) => state.auth.userData);
  const storyData = useSelector((state) => state.newsF.stories);
  const profileDP = useSelector((state) => state.prof.profilePicture);
  const my_storyData = useSelector((state) => state.blackNewsF?.setStories);

  const loginUserId = userData?.id;

  const mySeen = my_storyData
    ?.map((story) => story?.seen)
    ?.find((seen) => seen === true);

  const userHasStory = storyData.some((story) => story.user_id === user?.id);
  const borderStyle = getBorderStyle(
    userData,
    user,
    my_storyData,
    mySeen,
    userHasStory,
    storyData
  );

  const openUserStory = (user_id) => {
    getOpenUserStory(
      user_id,
      userData,
      my_storyData,
      storyData,
      setCurrentUserStories,
      setIsModalOpen,
      navigation
    );
  };

  return (
    <>
      {pages ? (
        <TouchableOpacity
          // onPress={() => {
          //   navigation.navigate("ProfileScreen", {
          //     userName: user?.name,
          //   });
          // }}
          onPress={() => {
            SimpleToast.show("To view pages, check the website.");
          }}
        >
          <FastImage
            style={styles.dp}
            source={
              pages?.page_picture != null
                ? {
                    uri: SITE_URL + pages?.page_picture,
                  }
                : IMAGES.blankDP
            }
          />
        </TouchableOpacity>
      ) : groups ? (
        <TouchableOpacity
          onPress={() => {
            openUserStory(user?.id);
          }}
        >
          <FastImage
            style={[styles.dp, borderStyle]}
            source={
              user?.profile_picture != null
                ? {
                    // uri: SITE_URL + groups?.cover_photo,
                    uri: SITE_URL + user?.profile_picture,
                  }
                : IMAGES.blankDP
            }
          />
        </TouchableOpacity>
      ) : rooms ? (
        <TouchableOpacity
          onPress={() => {
            openUserStory(user?.id);
          }}
        >
          <FastImage
            style={[styles.dp, borderStyle]}
            source={
              user?.profile_picture != null
                ? {
                    uri:
                      user?.id == loginUserId
                        ? profileDP || SITE_URL + user?.profile_picture
                        : SITE_URL + user?.profile_picture,
                  }
                : user?.id == loginUserId && profileDP !== null
                ? { uri: profileDP }
                : IMAGES.blankDP
            }
          />
        </TouchableOpacity>
      ) : events ? (
        <TouchableOpacity
          onPress={() => {
            openUserStory(user?.id);
          }}
        >
          <FastImage
            style={[styles.dp, borderStyle]}
            source={
              user?.profile_picture != null
                ? {
                    // uri: SITE_URL + events?.event_cover_picture,
                    uri: SITE_URL + user?.profile_picture,
                  }
                : IMAGES.blankDP
            }
          />
        </TouchableOpacity>
      ) : shared_page_post ? (
        <TouchableOpacity
          // onPress={() => {
          //   navigation.navigate("ProfileScreen", {
          //     userName: user?.name,
          //   });
          // }}
          onPress={() => {
            SimpleToast.show("To view pages, check the website.");
          }}
        >
          <FastImage
            style={styles.dp}
            source={
              shared_page_post?.page_picture != null
                ? {
                    uri: SITE_URL + shared_page_post?.page_picture,
                  }
                : IMAGES.blankDP
            }
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            openUserStory(user?.id);
          }}
        >
          <FastImage
            style={[styles.dp, borderStyle]}
            source={
              user?.profile_picture != null
                ? {
                    uri:
                      user?.id == loginUserId
                        ? profileDP || SITE_URL + user?.profile_picture
                        : SITE_URL + user?.profile_picture,
                  }
                : user?.id == loginUserId && profileDP !== null
                ? { uri: profileDP }
                : IMAGES.blankDP
            }
          />
        </TouchableOpacity>
      )}

      <StoryModel
        isOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        data={currentUserStories}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  dp: {
    width: 50,
    height: 50,
    borderRadius: 50,
    // borderWidth: 4,
    // borderColor: COLORS.primary,
  },
});
export default React.memo(Dp);
