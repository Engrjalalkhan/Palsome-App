import React, { useCallback, useRef, useState } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getWidth } from "../../../Utils/NewResponsive.js";
import { SITE_URL } from "../../Services/Constants";
import { COLORS } from "../../Constants/Colors";

const CustomSwiper = ({ data }) => {
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const handlePagination = (index) => {
    flatListRef.current.scrollToIndex({ animated: true, index });
    setCurrentIndex(index);
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }, []);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item, index }) => (
          <Pressable
            style={{
              width:
                Platform.OS === "android" ? getWidth(88.9) : getWidth(90.7),
              height: 300,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("BuyNsellShowImage", {
                url: data.map((image) => ({
                  uri: SITE_URL + image?.file_path,
                })),
                currentIndex: index,
              });
            }}
          >
            <Image
              source={{ uri: SITE_URL + item?.file_path }}
              style={styles.image}
            />
          </Pressable>
        )}
      />
      <View style={styles.paginationStyle}>
        {data.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.paginationStyleItem,
              {
                backgroundColor:
                  currentIndex === index ? "red" : COLORS.cocoGrey,
              },
            ]}
            onPress={() => handlePagination(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = {
  paginationStyle: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  paginationStyleItem: {
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 5,
  },
  image: { width: "100%", height: "100%", resizeMode: "contain" },
};

export default CustomSwiper;
