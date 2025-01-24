import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import BackPress from "../../../../../Components/BackPress";
import BuyNsellHeader from "../HeaderComponent";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation from React Navigation
import CreateItemComponent from "../CreateitemComponent.js";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../../../Utils/NewResponsive";
import { COLORS } from "../../../../../Constants/Colors";
import AreaText from "../ExploreDetailComponent/AreaText";
import ReadMoreText from "../ReadMore/ReadMoreText";
import { IMAGES } from "../../../../../Constants/Images";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { withoutStringiApiCall2 } from "../../../../../Services/Apis/index.js";
import { useSelector } from "react-redux";
import { SITE_URL } from "../../../../../Services/Constants/index.js";
import CustomSwiper from "../../../../../Components/CustomSwiper/index.js";

const ExploreDetailScreen = (props) => {
  const navigation = useNavigation(); // Get the navigation object using useNavigation

  const item = props.route.params.item;

  const { t } = useTranslation();
  const userToken = useSelector((state) => state.auth.userToken);

  const [isCreateItem, setIsCreateItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [itemDetail, setItemDetail] = useState();

  const getItemDetailsBuynSellReq = async () => {
    setLoading(true);
    try {
      const res = await withoutStringiApiCall2({
        route: `buynsell/item/show/${item.encrypted_id}/index`,
        verb: "GET",
        token: userToken,
      });
      if (res?.responseCode == 200) {
        setItemDetail(res?.payload?.data?.market_place);
        setLoading(false);
      } else {
        console.log("Error in BuyNsell Saga", res);
        setLoading(false);
      }
    } catch (e) {
      console.log("saga error -- ", e.toString());
    }
  };

  useEffect(() => {
    getItemDetailsBuynSellReq();
  }, []);

  const onPressBack = () => {
    navigation.goBack();
  };
  const onPressProfile = (item) => {
    navigation.navigate("ProfileScreen", {
      id: item?.id,
    });
  };
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
    <SafeAreaView style={styles.container}>
      <BuyNsellHeader
        onPressBack={onPressBack}
        isCreateItem={isCreateItem}
        setIsCreateItem={setIsCreateItem}
      />
      {itemDetail && !loading ? (
        <ScrollView>
          <View style={styles.contentContainer}>
            <CustomSwiper data={itemDetail?.marketmedia} />

            <Text style={styles.title}>{t(item?.title)}</Text>
            <TouchableOpacity style={styles.sell}>
              <Text style={styles.sellText}>{t("Sell")}</Text>
            </TouchableOpacity>

            <Text style={styles.price}>
              {item?.price && formatPrice(item?.price)}
            </Text>

            <Text style={styles.location}>{item?.location}</Text>
            <Text style={styles.title}>{t("Details")}</Text>
            <View style={styles.detailsContainer}>
              {itemDetail?.brand && (
                <AreaText title={t("Brand")} detail={t(itemDetail?.brand)} />
              )}
              {itemDetail?.make && (
                <AreaText title={t("Make")} detail={t(itemDetail?.make)} />
              )}
              {itemDetail?.Model && (
                <AreaText title={t("Model")} detail={t(itemDetail?.Model)} />
              )}
              {itemDetail?.year && (
                <AreaText title={t("Year")} detail={t(itemDetail?.year)} />
              )}
              {itemDetail?.fuel && (
                <AreaText title={t("Fuel Type")} detail={t(itemDetail?.fuel)} />
              )}
              {itemDetail?.condition && (
                <AreaText
                  title={t("Condition")}
                  detail={itemDetail?.condition}
                />
              )}
              {itemDetail?.area && (
                <AreaText title={t("Area")} detail={t(itemDetail?.area)} />
              )}
              {itemDetail?.area_unit && (
                <AreaText
                  title={t("Area Unit")}
                  detail={t(itemDetail?.area_unit)}
                />
              )}
            </View>
            {itemDetail?.features?.length > 0 && (
              <AreaText
                title={t("Features")}
                feature={itemDetail?.features}
                Wrap
              />
            )}
            {itemDetail?.description && <AreaText title={t("Description")} />}
            <ReadMoreText text={itemDetail?.description} />
            <AreaText title={t("Location")} />
            <Text>
              {itemDetail?.city?.title && itemDetail?.city?.title + ", "}
              {itemDetail?.state?.title && itemDetail?.state?.title + ", "}
              {itemDetail?.country?.title && itemDetail?.country?.title}
            </Text>

            <AreaText title={t("Seller information")} />
            <TouchableOpacity
              style={styles.userContainer}
              onPress={() => {
                onPressProfile(itemDetail?.user);
              }}
            >
              <Image
                source={
                  itemDetail?.user?.profile_picture
                    ? { uri: SITE_URL + itemDetail?.user?.profile_picture }
                    : IMAGES.blankDP
                }
                style={styles.userImage}
              />
              <Text>
                {itemDetail?.user?.first_name +
                  " " +
                  itemDetail?.user?.last_name}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={"large"} color={COLORS.primary} />
        </View>
      )}

      {isCreateItem && (
        <CreateItemComponent
          isVisible={isCreateItem}
          onDismiss={setIsCreateItem}
        />
      )}
    </SafeAreaView>
  );
};
const { width } = Dimensions.get("window");

export default ExploreDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  contentContainer: {
    width: getWidth(100),
    padding: 20,
  },
  paginationStyle: {
    position: "absolute",
    top: Platform.OS == "ios" ? getHeight(30) : getHeight(40),
  },
  paginationStyleItem: {
    height: 10,
    width: 10,
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  title: {
    fontSize: getFontSize(2.5),
    fontWeight: "bold",
    paddingTop: 40,
  },
  sell: {
    width: getWidth(15),
    backgroundColor: COLORS.cocoGrey,
    height: getHeight(4),
    marginTop: 10,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  sellText: {
    color: COLORS.primary,
    fontSize: getFontSize(2),
    fontWeight: "bold",
  },
  price: {
    fontSize: getFontSize(2.5),
    fontWeight: "bold",
    paddingTop: 10,
    color: COLORS.primary,
  },
  location: {
    paddingTop: 10,
    color: COLORS.tooDarkGrey,
  },
  detailsContainer: {
    width: getWidth(55),
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  userImage: {
    borderRadius: 25,
    height: 50,
    width: 50,
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
