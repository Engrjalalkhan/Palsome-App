import React, { useCallback, useRef, useState } from "react";

import { View, Text, ActivityIndicator, Platform } from "react-native";

import { SwiperFlatList } from "react-native-swiper-flatlist";

import Video from "react-native-video";
import { SITE_URL } from "../../Services/Constants";
import { getHeight, getWidth } from "../../../Utils/NewResponsive.js";

const ITEM_CONTAINER_STYLE = {
  width: Platform.OS === "android" ? getWidth(100) : getWidth(100),
  height: getHeight(80),
  justifyContent: "center",
  alignItems: "center",
};

const CustomVideoSwiper = ({ userVideos, userName, initialIndex }) => {
  const flatListRef = useRef();
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      console.log("Loading more====");
    }
  };

  return (
    <View>
      <SwiperFlatList
        ref={flatListRef}
        data={userVideos}
        horizontal
        pagingEnabled
        index={initialIndex}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => {
          return (
            <View style={ITEM_CONTAINER_STYLE}>
              <Video
                source={{ uri: SITE_URL + item?.path }}
                style={{ height: "98%", width: "100%" }}
                controls={true}
                resizeMode={"contain"}
                paused={index !== currentIndex}
                poster={
                  SITE_URL + "converted_videos/thumbnails/" + item?.thumb_path
                }
              />
              <Text>{item.title}</Text>
            </View>
          );
        }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" /> : null
        }
      />
    </View>
  );
};

export default CustomVideoSwiper;
