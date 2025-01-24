import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../../../Utils/NewResponsive";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import Toast from "react-native-simple-toast";
import { ActivityIndicator } from "react-native";
import EditDeleteModal from "../EditDeleteModel";
import NoCreatedAdMessage from "../NoCreatedAdMessage";
import BuyNSellSearchComponent from "../BuyNsellSearch";
import { COLORS } from "../../../../../Constants/Colors";
import { IMAGES } from "../../../../../Constants/Images";
import RenderGrid from "../RenderTiles&GridItems/RenderGrid";
import RenderTiles from "../RenderTiles&GridItems/RenderTiles";
import LogoutModal from "../../../../../Components/LogoutModal";
import { withoutStringiApiCall2 } from "../../../../../Services/Apis";
import EditItemForDraftComponent from "../BuyNsellDraftEditComponent.js";

const Drafts = ({
  navigation,

  onPressEditDeleteModel,
  newDataApiCall,
}) => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.userData);
  const userToken = useSelector((state) => state.auth.userToken);

  const [isGrid, setIsGrid] = useState(true);
  const [lastPage, setLastPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [yourDrafts, setYourDrafts] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditItem, setIsEditItem] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sureModalTitle, setSureModalTitle] = useState("");
  const [editDeleteItems, setEditDeleteItems] = useState("");
  const [editDeleteModal, setEditDeleteModal] = useState(false);
  const [functionCondition, setFunctionCondition] = useState("");
  const [sureContainerTitle, setSureContainerTitle] = useState("");
  const [isEditItemForDraft, setIsEditItemForDraft] = useState(false);
  const [fetchNewData, setFetchNewData] = useState(false);
  const toggleView = () => {
    setIsGrid(!isGrid);
  };
  const onPressExploreDetail = (item) => {
    navigation.navigate("ExploreDetailScreen", { item: item });
  };

  const onPressGetNewData = () => {
    setFetchNewData(true);
  };

  const yourDraftsBuyNsellReq = async () => {
    setLoading(true);
    setLoadingMore(true);
    try {
      const res = await withoutStringiApiCall2({
        route: `buynsell/draft?limit=12&page=${currentPage}`,
        verb: "GET",
        token: userToken,
      });
      if (res?.responseCode == 200) {
        if (currentPage === 1) {
          setYourDrafts(res?.payload?.data?.market_place?.data);
          setFetchNewData(false);
          setLoadingMore(false);
        } else {
          const newData = res?.payload?.data?.market_place?.data.filter(
            (item) =>
              !yourDrafts.some((existingItem) => existingItem.id === item.id)
          );
          const data = [...yourDrafts, ...newData];
          setYourDrafts(data);
          setLoadingMore(false);
          setLoading(false);
          setFetchNewData(false);
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
  const debouncedSetSearchText = debounce(async (searchQuery) => {
    try {
      const res = await withoutStringiApiCall2({
        route: `buynsell/search_modules?search_value=${searchQuery}&search_handle=draft`,
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

  const setSearchText = (searchQuery) => {
    setSearchQuery(searchQuery);
    debouncedSetSearchText(searchQuery);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (isMounted) {
        await yourDraftsBuyNsellReq();
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [currentPage, fetchNewData, newDataApiCall]);

  const onPressRemoveModal = (val, active) => {
    setEditDeleteModal(false);
    setTimeout(() => {
      if (val === "remove") {
        setFunctionCondition(val);
        setSureContainerTitle(t("Are you sure you want to Delete this?"));
        setSureModalTitle(t("You can't undo this action."));
      } else if (val === "deactivate" && active !== "active") {
        setFunctionCondition(val);
        setSureContainerTitle(t("Are you sure you want to Deactive it?"));
      } else if (val === "sold") {
        setFunctionCondition(val);
        setSureContainerTitle(t("Are you sure you want to Mark As Sold this?"));
        setSureModalTitle(t("You can undo this action."));
      } else if (active === "active") {
        setSureContainerTitle(t("Are you sure you want to Active this?"));

        setFunctionCondition(active);
      }

      setDeleteModal(true);
    }, 0);
  };

  const onPresRemoveItemApiRequest = async () => {
    setDeleteModal(false);
    try {
      const res = await withoutStringiApiCall2({
        route: `buynsell/item/destroy/${editDeleteItems?.encrypted_id}`,
        verb: "GET",
        token: userToken,
      });

      if (res?.responseCode == 200) {
        yourDraftsBuyNsellReq();
        setLoading(false);
        Toast.show(res?.message);
      } else {
        console.log("Error in BuyNsell Saga", res);
        setLoading(false);
      }
    } catch (e) {
      console.log("saga error -- ", e.toString());
    }
  };

  const onPressEditModal = () => {
    setEditDeleteModal(false);
    setTimeout(() => {
      setIsEditItemForDraft(true);
    }, 0);
  };

  onPressEditDeleteModel = (item) => {
    setEditDeleteItems(item);
    setEditDeleteModal(true);
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
          onPressEditDeleteModel(item);
        }}
        isAdmin={item?.user_id === user?.id}
        // yourAds={true}
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
      />
    );
  };

  const memoizedRenderItem = useMemo(() => renderItem, [yourDrafts]);
  const memoizedRenderGridItem = useMemo(() => renderGridItem, [yourDrafts]);

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
      ) : yourDrafts?.length > 0 ? (
        isGrid ? (
          <FlatList
            data={searchQuery ? searchData : yourDrafts}
            numColumns={2}
            renderItem={memoizedRenderItem}
            keyExtractor={(item, index) => `${item.key}-${index}`}
            onEndReached={() => handleLoadMore()}
            onEndReachedThreshold={0.2}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <FlatList
            data={searchQuery ? searchData : yourDrafts}
            key="gridView"
            renderItem={memoizedRenderGridItem}
            keyExtractor={(item, index) => `${item.key}-${index}`}
            onEndReached={() => handleLoadMore()}
            onEndReachedThreshold={0.2}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={"large"} color={COLORS.primary} />
        </View>
      ) : (
        <NoCreatedAdMessage titleMessage={t("You have no listing in draft")} />
      )}

      {editDeleteModal && (
        <EditDeleteModal
          modalVisible={editDeleteModal}
          setModalVisible={setEditDeleteModal}
          onPressEditModel={(item) => {
            onPressEditModal(item);
          }}
          onPressRemoveModal={() => {
            onPressRemoveModal("remove");
          }}
          onPressDeActiveModal={(e) => {
            onPressRemoveModal("deactivate", e);
          }}
          onPressMarkAsSold={() => {
            onPressRemoveModal("sold");
          }}
          item={editDeleteItems}
        />
      )}
      {deleteModal && (
        <LogoutModal
          isVisible={deleteModal}
          setIsVisible={setDeleteModal}
          message={sureModalTitle}
          title={sureContainerTitle}
          onYesPress={() => {
            if (functionCondition === "remove") {
              onPresRemoveItemApiRequest();
            } else if (functionCondition === "deactivate") {
              onPressDeActiveApiRequest(functionCondition);
            } else if (functionCondition === "sold") {
              onPressDeActiveApiRequest(functionCondition);
            } else if (functionCondition === "active") {
              onPressDeActiveApiRequest(functionCondition);
            }
          }}
        />
      )}
      {isEditItemForDraft && (
        <EditItemForDraftComponent
          isVisible={isEditItemForDraft}
          onDismiss={setIsEditItemForDraft}
          onPressGetNewData={(val) => {
            onPressGetNewData(val);
          }}
          itemId={editDeleteItems?.encrypted_id}
        />
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

export default Drafts;
