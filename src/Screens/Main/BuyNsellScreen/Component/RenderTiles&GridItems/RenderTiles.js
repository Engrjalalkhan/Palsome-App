import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SITE_URL } from "../../../../../Services/Constants";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../../../Utils/NewResponsive";
import { COLORS } from "../../../../../Constants/Colors";
import { IMAGES } from "../../../../../Constants/Images";

const RenderTiles = ({
  item,
  onPressExploreDetail,
  onPressEditDeleteModel,
  isAdmin,
  explore,
  onPressFavorite,
  Favorites,
  yourAds,
}) => {
  const { t } = useTranslation();

  const coverItem = item.marketmedia.find(
    (mediaItem) => mediaItem.is_cover === 1
  );
  const coverFilePath = coverItem
    ? SITE_URL + coverItem.file_path
    : SITE_URL + item?.marketmedia[0]?.file_path;

  const currency = item?.country?.currency;

  const formatPrice = (price) => {
    const formattedPrice = (price / 100)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const finalPrice = formattedPrice.endsWith(".00")
      ? formattedPrice.slice(0, -3)
      : formattedPrice;

    return `${currency ? currency : ""} ${finalPrice}`;
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          onPressExploreDetail(item);
        }}
      >
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{
              uri: coverFilePath,
            }}
            style={styles.image}
          >
            {yourAds && (
              <View
                style={[
                  styles.textContainer,
                  {
                    backgroundColor:
                      item?.status === "active" ? COLORS.parrot : COLORS.grey,
                  },
                ]}
              >
                <Text style={styles.text}>{t(item?.status)}</Text>
              </View>
            )}
          </ImageBackground>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            {item?.price && formatPrice(item?.price)}
          </Text>

          {isAdmin && !Favorites ? (
            <TouchableOpacity
              onPress={() => {
                onPressEditDeleteModel();
              }}
            >
              <Image
                source={IMAGES.buyNsellDotedMenu}
                style={styles.dotedContainer}
              />
            </TouchableOpacity>
          ) : explore && !isAdmin ? (
            <TouchableOpacity
              onPress={() => {
                onPressFavorite();
              }}
            >
              {item?.favorite_item == null ? (
                <Image
                  source={IMAGES.buyNsellHeartNotLike}
                  style={styles.dotedContainer}
                />
              ) : (
                <Image
                  source={IMAGES.buyNsellHeartLikeGrid}
                  style={styles.dotedContainer}
                />
              )}
            </TouchableOpacity>
          ) : (
            Favorites && (
              <TouchableOpacity
                onPress={() => {
                  onPressFavorite();
                }}
              >
                <Image
                  source={IMAGES.buyNsellHeartLikeGrid}
                  style={styles.dotedContainer}
                />
              </TouchableOpacity>
            )
          )}
        </View>
        <View style={styles.specificationContainer}>
          <Text numberOfLines={1} style={styles.specificationText}>
            {item?.title}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default RenderTiles;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3, // Android shadow

    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    margin: 10,
    right: Platform.OS === "android" && 4,
  },
  imageContainer: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: "hidden",
  },

  image: {
    height: getHeight(25),
    width: getWidth(45),
    resizeMode: "cover",
  },
  nameContainer: {
    width: getWidth(45),
    padding: 10,
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nameText: {
    color: "white",
    fontWeight: "bold",
    fontSize: getFontSize(2),
    width: getWidth(36),
    paddingRight: 5,
  },
  specificationContainer: {
    width: getWidth(45),
    padding: 10,
    zIndex: 0,
  },
  specificationText: {
    fontWeight: "700",
    fontSize: getFontSize(1.8),
    maxHeight: 80,
    overflow: "hidden",
  },
  dotedContainer: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    padding: 10,
  },
  textContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: COLORS.lightGreen,
    padding: 10,
    margin: 5,
    borderRadius: 10,
  },
  text: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
