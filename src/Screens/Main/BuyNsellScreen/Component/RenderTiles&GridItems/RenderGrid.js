import {
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import { SITE_URL } from "../../../../../Services/Constants";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../../../Utils/NewResponsive";
import { IMAGES } from "../../../../../Constants/Images";
import { COLORS } from "../../../../../Constants/Colors";

const RenderGrid = ({
  item,
  onPressExploreDetail,
  onPressEditDeleteModel,
  isAdmin,
  onPressFavorite,
  explore,
  Favorites,
  yourAds,
}) => {
  let city = item.city?.title;
  let state = item.state?.title;
  let country = item.country?.title;

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
    <TouchableOpacity
      style={styles.gridCard}
      onPress={() => {
        onPressExploreDetail(item);
      }}
    >
      <ImageBackground
        source={{
          uri: coverFilePath,
        }}
        style={styles.gridImage}
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
      <View style={{ width: getWidth(46) }}>
        <Text numberOfLines={2} style={styles.gridSpecificationText}>
          {item?.title}
        </Text>
        <Text style={styles.gridNameText}>
          {item?.price && formatPrice(item?.price)}
        </Text>

        <View style={{ height: 20, marginTop: 10 }}>
          <Text style={styles.locationContainer}>
            {city && `${city}, `}
            {state && `${state}, `}
            {country && `${country}`}
          </Text>
        </View>
      </View>

      {isAdmin && !Favorites ? (
        <TouchableOpacity
          onPress={() => {
            onPressEditDeleteModel();
          }}
          style={styles.dotedContainerStyle}
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
          style={styles.dotedContainerStyle}
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
            style={styles.dotedContainerStyle}
          >
            <Image
              source={IMAGES.buyNsellHeartLikeGrid}
              style={styles.dotedContainer}
            />
          </TouchableOpacity>
        )
      )}
    </TouchableOpacity>
  );
};

export default RenderGrid;

const styles = StyleSheet.create({
  gridCard: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    margin: 5,
    flexDirection: "row",
    alignItems: "flex-start",
    width: getWidth(97),
  },
  gridImage: {
    height: getHeight(14.5),
    width: getWidth(40),
    resizeMode: "contain",
    margin: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    resizeMode: "cover",
  },
  gridNameText: {
    color: "black",
    fontWeight: "bold",
    fontSize: getFontSize(2),
    marginHorizontal: 8,
    bottom: 10,
  },
  locationContainer: {
    color: COLORS.darkGray,
    fontSize: getFontSize(1.5),
    marginLeft: 8,
  },
  gridSpecificationText: {
    paddingBottom: 10,
    // fontWeight: "700",
    fontSize: getFontSize(1.8),
    width: getWidth(42),
    marginHorizontal: 8,
    marginTop: 15,
    height: getFontSize(7),
  },
  dotedContainer: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    padding: 10,
    tintColor: COLORS.primary,
    marginTop: 18,
  },
  dotedContainerStyle: {
    width: getWidth(7),
    height: getHeight(7),
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
