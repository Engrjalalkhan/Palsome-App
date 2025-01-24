import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
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
import { useSelector } from "react-redux";
import Toast from "react-native-simple-toast";
import NoCreatedAdMessage from "../NoCreatedAdMessage";
import BuyNSellSearchComponent from "../BuyNsellSearch";
import { IMAGES } from "../../../../../Constants/Images";
import { COLORS } from "../../../../../Constants/Colors";
import RenderGrid from "../RenderTiles&GridItems/RenderGrid";
import RenderTiles from "../RenderTiles&GridItems/RenderTiles";

import {
  postStatusApiCall,
  withoutStringiApiCall2,
} from "../../../../../Services/Apis";
import { debounce } from "lodash";

const Favorites = ({ navigation, onPressEditDeleteModel }) => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.userData);
  const userToken = useSelector((state) => state.auth.userToken);

  const [isGrid, setIsGrid] = useState(true);
  const [lastPage, setLastPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [yourFavorites, setYourFavorites] = useState([]);

  const toggleView = () => {
    setIsGrid(!isGrid);
  };
  const onPressExploreDetail = (item) => {
    navigation.navigate("ExploreDetailScreen", { item: item });
  };

  const yourFavoriteBuyNsellReq = async () => {
    setLoading(true);
    setLoadingMore(true);
    try {
      const res = await withoutStringiApiCall2({
        route: `buynsell/show_faverite_item?limit=12&page=${currentPage}`,
        verb: "GET",
        token: userToken,
      });
      if (res?.responseCode == 200) {
        if (currentPage === 1) {
          setYourFavorites(res?.payload?.data?.market_place?.data);
          setLoadingMore(false);
        } else {
          const newData = res?.payload?.data?.market_place?.data.filter(
            (item) =>
              !yourFavorites.some((existingItem) => existingItem.id === item.id)
          );
          const data = [...yourFavorites, ...newData];
          setYourFavorites(data);
          setLoadingMore(false);
          setLoading(false);
        }
        setLastPage(res?.payload?.data?.market_place?.last_page);
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
    let isMounted = true;
    const fetchData = async () => {
      if (isMounted) {
        await yourFavoriteBuyNsellReq();
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const onPressFavoriteItem = async (item) => {
    const formData = new FormData();
    formData.append("item_id", item?.encrypted_id);
    {
      item == null
        ? formData.append("handle", "favorite")
        : formData.append("handle", "unfavoribal");
    }

    try {
      const res = await postStatusApiCall({
        route: "buynsell/faverite_item",
        verb: "POST",
        token: userToken,
        body: formData,
      });
      if (res?.responseCode === 200) {
        setCurrentPage(1);
        yourFavoriteBuyNsellReq();

        Toast.show(res?.message);
      } else {
        Toast.show(res?.message);
      }
    } catch (e) {
      console.log("saga update error----- ", e.toString());
    }
  };
  const debouncedSetSearchText = debounce(async (searchQuery) => {
    setLoading(true);
    try {
      const res = await withoutStringiApiCall2({
        route: `buynsell/search_modules?search_value=${searchQuery}&search_handle=favorite`,
        verb: "GET",
        token: userToken,
      });
      if (res?.responseCode === 200) {
        setSearchData(res?.payload?.data?.market_place);
        setLoading(false);
      } else {
        console.log("Error in BuyNsell Saga", res);
      }
    } catch (e) {
      console.log("saga error -- ", e.toString());
    }
  }, 500);

  const setSearchText = (searchQuery) => {
    setSearchQuery(searchQuery);
    debouncedSetSearchText(searchQuery);
  };
  const handleLoadMore = () => {
    if (currentPage < lastPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <RenderTiles
        item={item}
        onPressExploreDetail={() => {
          onPressExploreDetail(item);
        }}
        onPressEditDeleteModel={() => {
          onPressEditDeleteModel();
        }}
        isAdmin={true}
        Favorites={true}
        onPressFavorite={() => {
          onPressFavoriteItem(item);
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
          onPressEditDeleteModel();
        }}
        isAdmin={true}
        Favorites={true}
        onPressFavorite={() => {
          onPressFavoriteItem(item);
        }}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.gridTileContainer}>
        <View style={styles.filterByContainer}>
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
      </View>
      {searchQuery && searchData.length === 0 ? (
        <View style={styles.loading}>
          <NoCreatedAdMessage titleMessage={t("No Record Found")} />
        </View>
      ) : yourFavorites?.length > 0 ? (
        isGrid ? (
          <FlatList
            data={searchQuery ? searchData : yourFavorites}
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
            data={searchQuery ? searchData : yourFavorites}
            key="gridView"
            renderItem={renderGridItem}
            keyExtractor={(item, index) => `${item.key}-${index}`}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={"large"} color={COLORS.primary} />
        </View>
      ) : (
        <NoCreatedAdMessage titleMessage={t("No Favorite to show")} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gridTileContainer: {
    alignItems: "flex-end",
    width: getWidth(100),
    alignItems: "center",
  },
  filterByContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: getWidth(92),
  },
  filterIcon: {
    height: getHeight(2),
    width: getWidth(28),
    resizeMode: "contain",
  },

  gridTileIcon: {
    height: 35,
    width: 35,
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
  },
  loading: {
    width: getWidth(100),
    height: getHeight(50),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Favorites;
