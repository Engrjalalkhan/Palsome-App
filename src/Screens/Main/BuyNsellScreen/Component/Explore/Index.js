import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../../../Utils/NewResponsive";

import { debounce } from "lodash";
import { useSelector } from "react-redux";
import NoCreatedAdMessage from "../NoCreatedAdMessage";
import BuyNSellSearchComponent from "../BuyNsellSearch";
import { IMAGES } from "../../../../../Constants/Images";
import { COLORS } from "../../../../../Constants/Colors";
import RenderGrid from "../RenderTiles&GridItems/RenderGrid";
import RenderTiles from "../RenderTiles&GridItems/RenderTiles";
import { withoutStringiApiCall2 } from "../../../../../Services/Apis";

const ExploreComponent = ({
  data,
  navigation,
  loading,
  handleLoadMore,
  onPressEditDeleteModel,
  onPressFavorite,
  allExploreData,
  filterDataParams,
  sub_categories,
  renderFooter,
}) => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.userData);
  const userToken = useSelector((state) => state.auth.userToken);

  const [isGrid, setIsGrid] = useState(true);
  const [searchData, setSearchData] = useState([]);
  const [countryId, setCountryId] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  let selectedCity = allExploreData?.selected_city;
  let selectedState = allExploreData?.selected_state;
  let selectedCountry = allExploreData?.selected_country;

  useEffect(() => {
    const countryItem = allExploreData?.countries?.find(
      (item) => item?.title === selectedCountry
    );
    if (countryItem) {
      setCountryId(countryItem?.id);
    } else {
      console.log("Error: Country not found");
    }
  }, [allExploreData, navigation]);

  const toggleView = () => {
    setIsGrid(!isGrid);
  };
  const onPressExploreDetail = (item) => {
    navigation.navigate("ExploreDetailScreen", { item: item });
  };

  const onPressCategories = () => {
    navigation.navigate("Categories");
  };

  const onPressFilter = () => {
    navigation.navigate("FilterScreen", { data: allExploreData });
  };
  const debouncedSetSearchText = debounce(async (searchQuery) => {
    try {
      const res = await withoutStringiApiCall2({
        route: `buynsell/search_modules?search_value=${searchQuery}&search_handle=explore&country_id=${countryId}`,
        verb: "GET",
        token: userToken,
      });
      if (res?.responseCode === 200) {
        setSearchData(res?.payload?.data?.market_place);
      } else {
        console.log("Error in BuyNsell Saga", res);
      }
    } catch (e) {
      console.log("saga error -- ", e.toString());
    }
  }, 500);

  const setSearchText = async (searchQuery) => {
    setSearchQuery(searchQuery);
    debouncedSetSearchText(searchQuery);
  };

  const renderItem = ({ item }) => {
    return (
      <RenderTiles
        item={item}
        onPressExploreDetail={() => {
          onPressExploreDetail(item);
        }}
        onPressEditDeleteModel={() => {
          onPressEditDeleteModel(item);
        }}
        isAdmin={item?.user_id === user?.id}
        explore
        onPressFavorite={() => {
          onPressFavorite(item);
        }}
      />
    );
  };
  const renderGridItem = ({ item }) => {
    return (
      <RenderGrid
        item={item}
        onPressExploreDetail={() => {
          onPressExploreDetail(item);
        }}
        onPressEditDeleteModel={() => {
          onPressEditDeleteModel(item);
        }}
        isAdmin={item?.user_id === user?.id}
        explore
        onPressFavorite={() => {
          onPressFavorite(item);
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.gridTileContainer}>
        <View style={styles.searchQueryContainer}>
          <BuyNSellSearchComponent setSearchText={setSearchText} />
          {isGrid ? (
            <TouchableOpacity
              onPress={() => {
                toggleView();
              }}
            >
              <Image source={IMAGES.grid} style={styles.gridTileIcon} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                toggleView();
              }}
            >
              <Image source={IMAGES.tiles} style={styles.gridTileIcon} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.filterByContainer}>
          {sub_categories ? (
            <View style={styles.categoriesTitleContainer}>
              <Text numberOfLines={1} style={[styles.categoriesText]}>
                {filterDataParams?.item?.name}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.categoriesContainer}
              onPress={() => {
                onPressCategories();
              }}
            >
              <Text style={styles.categoriesText}>{t("Categories")}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.locationContainer}
            onPress={() => {
              onPressFilter();
            }}
          >
            <Text
              style={{
                color: COLORS.blueLight,
              }}
              numberOfLines={1}
            >
              {selectedCountry
                ? `${selectedCity ? selectedCity + "," : ""}${
                    selectedState ? selectedState + "," : ""
                  }${selectedCountry}`
                : filterDataParams?.countryValue &&
                  filterDataParams?.countryValue +
                    (filterDataParams?.stateValue
                      ? "," + filterDataParams?.stateValue
                      : "") +
                    (filterDataParams?.cityValue
                      ? "," + filterDataParams?.cityValue
                      : "")}
            </Text>
          </TouchableOpacity>
          {!sub_categories && (
            <TouchableOpacity
              onPress={() => {
                onPressFilter();
              }}
            >
              <Image source={IMAGES.filterBy} style={styles.filterIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {searchQuery && searchData.length === 0 ? (
        <View style={styles.loading}>
          <NoCreatedAdMessage titleMessage={t("No Record Found")} />
        </View>
      ) : data?.length > 0 ? (
        isGrid ? (
          <FlatList
            data={searchQuery ? searchData : data}
            numColumns={2}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.key}-${index}`}
            onEndReached={() => handleLoadMore()}
            onEndReachedThreshold={0.2}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={searchQuery ? searchData : data}
            key="gridView"
            renderItem={renderGridItem}
            onEndReached={() => handleLoadMore()}
            onEndReachedThreshold={0.2}
            ListFooterComponent={renderFooter}
            keyExtractor={(item, index) => `${item.key}-${index}`}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={"large"} color={COLORS.primary} />
        </View>
      ) : (
        data?.length === 0 &&
        !loading && <NoCreatedAdMessage titleMessage={t("Data Not Found")} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gridTileContainer: {
    // alignItems: "flex-end",
    // paddingRight: Platform.OS === "ios" ? getWidth(3.5) : getWidth(2),
    width: getWidth(100),
    alignItems: "center",
    justifyContent: "center",
  },
  filterByContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: getWidth(100),
  },
  filterIcon: {
    height: getHeight(2),
    width: getWidth(25),
    resizeMode: "contain",
  },
  searchQueryContainer: {
    marginBottom: 10,
    width: getWidth(90),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    left: 2,
  },
  locationContainer: {
    width: getWidth(40),
    color: COLORS.blueLight,
    alignItems: "flex-end",
    marginLeft: 15,
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    margin: 5,
    height: 40,
    width: getWidth(28),
    // right: getWidth(2),
    left: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoriesTitleContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: getWidth(100),
  },

  categoriesText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "bold",
  },

  gridTileIcon: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
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
  },
  nameText: {
    color: "white",
    fontWeight: "bold",
    fontSize: getFontSize(2),
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
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    width: getWidth(95),
  },
  gridImage: {
    height: getHeight(14.5),
    width: getWidth(40),
    resizeMode: "contain",
    margin: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    resizeMode: "cover",
  },
  gridNameText: {
    color: "black",
    fontWeight: "bold",
    fontSize: getFontSize(2),
  },
  gridSpecificationText: {
    paddingBottom: 10,
    // fontWeight: "700",
    fontSize: getFontSize(1.8),
    width: getWidth(48),
  },
  loading: {
    width: getWidth(100),
    height: getHeight(50),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ExploreComponent;
