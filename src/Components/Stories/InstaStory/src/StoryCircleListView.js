import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FlatList, Platform, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import StoryCard from "../../StoryCard";
import { useTranslation } from "react-i18next";
import StorySideIcon from "../../StorySideIcon";
import CreateStoryCard from "../../CreateStoryCard";
import StoryCircleListItem from "./StoryCircleListItem";

import { SITE_URL } from "../../../../Services/Constants";
import { IMAGES } from "../../../../Constants/Images";
import { isRTL } from "../../../../../Utils/IsRTL";

const StoryCircleListView = ({ data, handleStoryItemPress }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const condition = isRTL && data?.length > 2 ? true : !isRTL && true;

  const userData = useSelector((state) => state.auth.userData);
  const my_storyData = useSelector((state) => state.blackNewsF?.setStories);

  const [sideIcon, setSideIcon] = useState(false);

  const handleScroll = (event) => {
    isRTL && Platform.OS === "android"
      ? event.nativeEvent.contentOffset.x < 300 && data?.length > 3
        ? sideIcon
          ? null
          : setSideIcon(true)
        : setSideIcon(false)
      : event.nativeEvent.contentOffset.x > 95
      ? sideIcon
        ? null
        : setSideIcon(true)
      : setSideIcon(false);
  };

  return (
    <React.Fragment>
      {sideIcon && (
        <StorySideIcon
          source={
            userData?.profile_picture !== null
              ? {
                  uri: SITE_URL + userData?.profile_picture,
                }
              : IMAGES.blankDP
          }
        />
      )}
      <FlatList
        data={data}
        horizontal
        onScroll={handleScroll}
        style={styles.paddingLeft}
        scrollEnabled={Platform.OS === "android" ? condition : true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponentStyle={{ marginRight: 10, flexDirection: "row" }}
        ListHeaderComponent={
          <>
            <CreateStoryCard />

            {my_storyData?.length > 0 ? (
              <StoryCard
                onPress={() => {
                  navigation.navigate("myStory", {
                    my_storyData: my_storyData,
                    index: 0,
                  });
                }}
                item={my_storyData?.[0]?.items[0]}
                txt={t("My Story")}
              />
            ) : null}
          </>
        }
        renderItem={({ item, index }) => (
          <StoryCircleListItem
            item={item}
            handleStoryItemPress={() =>
              handleStoryItemPress && handleStoryItemPress(item, index)
            }
          />
        )}
      />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  paddingLeft: {
    paddingRight: 12,
  },
  footer: {
    flex: 1,
    width: 8,
  },
});

export default StoryCircleListView;
