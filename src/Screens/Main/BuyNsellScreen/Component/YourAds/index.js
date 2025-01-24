import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useState } from "react";

import {
  FlatList,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import Toast from "react-native-simple-toast";
import EditDeleteModal from "../EditDeleteModel";
import { ActivityIndicator } from "react-native";
import EditItemComponent from "../EditItemComponent";
import NoCreatedAdMessage from "../NoCreatedAdMessage";
import BuyNSellSearchComponent from "../BuyNsellSearch";
import { COLORS } from "../../../../../Constants/Colors";
import { IMAGES } from "../../../../../Constants/Images";
import RenderGrid from "../RenderTiles&GridItems/RenderGrid";
import RenderTiles from "../RenderTiles&GridItems/RenderTiles";
import LogoutModal from "../../../../../Components/LogoutModal";
import { getHeight, getWidth } from "../../../../../../Utils/NewResponsive";

import {
  postStatusApiCall,
  withoutStringiApiCall2,
} from "../../../../../Services/Apis";

const YourAds = ({
  navigation,
  onPressEditDeleteModel,
  newDataApiCall,
  setNewDataApiCall,
}) => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.userData);
  const userToken = useSelector((state) => state.auth.userToken);

  const [isGrid, setIsGrid] = useState(true);
  const [lastPage, setLastPage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [yourAdsData, setYourAdsData] = useState([]);
  const [isEditItem, setIsEditItem] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [sureModalTitle, setSureModalTitle] = useState("");
  const [editDeleteItems, setEditDeleteItems] = useState("");
  const [editDeleteModal, setEditDeleteModal] = useState(false);
  const [functionCondition, setFunctionCondition] = useState("");
  const [sureContainerTitle, setSureContainerTitle] = useState("");

  const toggleView = () => {
    setIsGrid(!isGrid);
  };
  const onPressExploreDetail = (item) => {
    navigation.navigate("ExploreDetailScreen", { item: item });
  };

  const debouncedSetSearchText = debounce(async (searchQuery) => {
    try {
      const res = await withoutStringiApiCall2({
        route: `buynsell/search_modules?search_value=${searchQuery}&search_handle=my_ad`,
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

  const yourAdsBuyNsellReq = async () => {
    setLoading(true);
    setLoadingMore(true);
    try {
      const res = await withoutStringiApiCall2({
        route: `buynsell?limit=12&page=${currentPage}`,
        verb: "GET",
        token: userToken,
      });

      if (res?.responseCode === 200) {
        setLastPage(res?.payload?.data?.market_place?.last_page);
        setYourAdsData((prevExploreData) => {
          if (currentPage === 1) {
            setNewDataApiCall(false);
            return res?.payload?.data?.market_place?.data;
          } else {
            const newData = res?.payload?.data?.market_place?.data || [];
            const newDataIds = new Set(newData.map((item) => item.id));
            const filteredData = prevExploreData.filter(
              (item) => !newDataIds.has(item.id)
            );
            return [...filteredData, ...newData];
          }
        });
        setNewDataApiCall(false);
        setLoading(false);
        setLoadingMore(false);
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
        await yourAdsBuyNsellReq();
      }
    };
    {
      newDataApiCall && (setYourAdsData([]), setCurrentPage(1));
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [currentPage, newDataApiCall]);

  onPressEditDeleteModel = (item) => {
    setEditDeleteItems(item);
    setEditDeleteModal(true);
  };
  onPressEditModal = () => {
    setEditDeleteModal(false);
    setTimeout(() => {
      setIsEditItem(true);
    }, 0);
  };

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
        setSureModalTitle(t("You can undo this action."));
      } else if (val === "sold") {
        setFunctionCondition(val);
        setSureContainerTitle(t("Are you sure you want to Mark As Sold this?"));
        setSureModalTitle(t("You can undo this action."));
      } else if (active === "active") {
        setSureContainerTitle(t("Are you sure you want to Active this?"));
        setSureModalTitle(t("You can undo this action."));

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
        const updatedData = yourAdsData.filter(
          (item) => item.encrypted_id !== editDeleteItems?.encrypted_id
        );
        setYourAdsData(updatedData);
        // yourAdsBuyNsellReq();
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

  const onPressDeActiveApiRequest = async (val) => {
    setDeleteModal(false);

    const formData = new FormData();
    let newStatus;

    // Determine the new status based on the current status
    if (val === "deactivate") {
      newStatus = "inactive";
    } else if (val === "sold") {
      newStatus = "sold";
    } else {
      // If 'val' is 'sold', set the status to 'sold'
      newStatus = "active";
    }

    formData.append("status", newStatus);

    try {
      const res = await postStatusApiCall({
        route: `buynsell/item/change_status/${editDeleteItems?.encrypted_id}`,
        verb: "POST",
        token: userToken,
        body: formData,
      });

      if (res?.responseCode === 200) {
        // Update the status of the item directly in yourAdsData
        const updatedData = yourAdsData.map((item) => {
          if (item.encrypted_id === editDeleteItems?.encrypted_id) {
            return { ...item, status: newStatus };
          }
          return item;
        });
        setYourAdsData(updatedData);
        Toast.show(res?.message);
      } else {
        Toast.show(res?.message);
      }
    } catch (e) {
      console.log("saga update error----- ", e.toString());
    }
  };

  const handleLoadMore = () => {
    if (currentPage < lastPage && !loadingMore) {
      setCurrentPage(currentPage + 1);
    }
  };

  const onPressGetNewData = () => {
    {
      currentPage == 1 && yourAdsBuyNsellReq();
    }
    setYourAdsData([]);
    setCurrentPage(1);
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
        yourAds={true}
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
        yourAds={true}
      />
    );
  };

  const memoizedRenderItem = useMemo(() => renderItem, [yourAdsData]);
  const memoizedRenderGridItem = useMemo(() => renderGridItem, [yourAdsData]);

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
      ) : yourAdsData?.length > 0 ? (
        isGrid ? (
          <FlatList
            data={searchQuery ? searchData : yourAdsData}
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
            data={searchQuery ? searchData : yourAdsData}
            key="gridView"
            renderItem={memoizedRenderGridItem}
            keyExtractor={(item, index) => `${item.key}-${index}`}
            onEndReached={() => handleLoadMore()}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0.2}
            showsVerticalScrollIndicator={false}
          />
        )
      ) : loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={"large"} color={COLORS.primary} />
        </View>
      ) : (
        <NoCreatedAdMessage
          titleMessage={t("You have not created any Ad")}
          subTitle={t("Created Ad will appear here")}
        />
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

      {isEditItem && (
        <EditItemComponent
          isVisible={isEditItem}
          onDismiss={setIsEditItem}
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

  loading: {
    width: getWidth(100),
    height: getHeight(50),
    alignItems: "center",
    justifyContent: "center",
  },
});

export default YourAds;
