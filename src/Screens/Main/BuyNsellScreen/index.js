import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  Platform,
} from "react-native";
import TopTabs from "./Component/TopTabs";
import Toast from "react-native-simple-toast";
import { useTranslation } from "react-i18next";
import Header from "../../../Components/Header";
import React, { useCallback, useEffect, useState } from "react";
import { IMAGES } from "../../../Constants/Images";
import { HP, WP } from "../../../../Utils/Resposive";
import MyListingComponent from "./Component/MyListing";
import { useDispatch, useSelector } from "react-redux";
import ExploreComponent from "./Component/Explore/Index";
import EditDeleteModal from "./Component/EditDeleteModel/index.js";
import LogoutModal from "../../../Components/LogoutModal/index.js";
import CreateItemComponent from "./Component/CreateitemComponent.js";
import { getHeight, getWidth } from "../../../../Utils/NewResponsive";
import EditItemComponent from "./Component/EditItemComponent/index.js";
import {
  postStatusApiCall,
  withoutStringiApiCall2,
} from "../../../Services/Apis/index.js";
import { getBuyNsellParentCategories } from "../../../Redux/actions/BuyNsellActions.js";
import EditItemForDraftComponent from "./Component/BuyNsellDraftEditComponent.js/index.js";
import { fetchEditProf } from "../../../Redux/actions/ProfileActions.js";
import { ActivityIndicator } from "react-native";
import { COLORS } from "../../../Constants/Colors.js";
import { isRTL } from "../../../../Utils/IsRTL/index.js";
import CustomSwitchLocation from "./Component/SwitchButton/index.js";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress.js";

const BuyNsellScreen = ({ navigation, route }) => {
  const filterDataParams = route?.params?.item;
  const fromDrawer = route?.params?.fromDrawer;
  
  var filterData = route?.params?.filter;
  var sub_categories = route?.params?.subCategories;
  const CategoriesTitle = route?.params?.subcategoriesTitle;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });


  const userToken = useSelector((state) => state.auth.userToken);
  const parentCategoryData = useSelector(
    (state) => state.buyNsellRed.parentCategoriesData
  );
  const user = useSelector((state) => state.auth.userData);

  const [itemId, setItemId] = useState("");
  const [lastPage, setLastPage] = useState("");
  const [explore, setExplore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [yourDrafts, setYourDrafts] = useState();
  const [myListing, setListing] = useState(false);
  const [yourAdsData, setYourAdsData] = useState();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [exploreData, setExploreData] = useState([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEditItem, setIsEditItem] = useState(false);
  const [yourFavorites, setYourFavorites] = useState();
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isCreateItem, setIsCreateItem] = useState(false);
  const [itemDataYourAds, setItemDataYourAds] = useState();
  const [sureModalTitle, setSureModalTitle] = useState("");
  const [newDataApiCall, setNewDataApiCall] = useState(false);
  const [editDeleteModal, setEditDeleteModal] = useState(false);
  const [functionCondition, setFunctionCondition] = useState("");
  const [sureContainerTitle, setSureContainerTitle] = useState("");
  const [isEditItemForDraft, setIsEditItemForDraft] = useState(false);
  const [allDataOfExploreBuyNsellReq, setAllDataOfExploreBuyNsellReq] =
    useState([]);
  const [shouldFetchExploreData, setShouldFetchExploreData] = useState(false);

  const onPressLocationToggle = useCallback(async () => {
    const formData = new FormData();
    let locationStatus = "";
    if (isEnabled) {
      locationStatus = "off";
    } else {
      locationStatus = "on";
    }
    formData.append("is_location", locationStatus);
    try {
      const res = await postStatusApiCall({
        route: "buynsell/change_location_status",
        verb: "POST",
        token: userToken,
        body: formData,
      });

      if (res?.responseCode === 200) {
        setIsEnabled((prev) => !prev);
        Toast.show(res?.message, Toast.LONG);
        setCurrentPage(1);
        setExploreData([]);
        setShouldFetchExploreData(true);
      } else {
        Toast.show(res?.message);
      }
    } catch (e) {
      console.log("saga update error----- ", e.toString());
    }
  }, [isEnabled]);

  useEffect(() => {
    if (shouldFetchExploreData) {
      exploreBuyNsellReq();
      setShouldFetchExploreData(false);
    }
  }, [shouldFetchExploreData]);

  const exploreBuyNsellReq = async () => {
    setLoading(true);
    setLoadingMore(true);
    try {
      const res = await withoutStringiApiCall2({
        route: `buynsell/explore?limit=12&page=${currentPage}`,
        verb: "GET",
        token: userToken,
      });

      if (res?.responseCode === 200) {
        setIsEnabled(res.payload?.data?.user_location === "on");
        setAllDataOfExploreBuyNsellReq(res?.payload?.data);
        setLastPage(res?.payload?.data?.market_place?.last_page);

        setExploreData((prevExploreData) => {
          if (currentPage === 1) {
            return res?.payload?.data?.market_place?.data || [];
          } else {
            const newData = res?.payload?.data?.market_place?.data || [];
            const newDataIds = new Set(newData.map((item) => item.id));
            const filteredData = prevExploreData.filter(
              (item) => !newDataIds.has(item.id)
            );
            return [...filteredData, ...newData];
          }
        });

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

  const getFilterDataApiRequest = async () => {
    setLoading(true);
    setLoadingMore(true);
    
    try {
      const res = await withoutStringiApiCall2({
        route: filterData
          ? `buynsell/item/searchByCategory?search_handle=explore&page=${currentPage}&limit=12
        &min_price=${filterDataParams?.minPrice}
        &max_price=${filterDataParams?.maxPrice}
        &country_id=${filterDataParams?.countryId}
        &state_id=${filterDataParams?.stateId || ''}
        &city_id=${filterDataParams?.cityId || ''}
        &category_id=${filterDataParams?.childCategoriesId}`
          : `buynsell/item/searchByCategory?search_handle=explore&page=${currentPage}&limit=12&category_id=
          ${filterDataParams?.item?.id}`,

        verb: "GET",
        token: userToken,
      });
      if (res?.responseCode === 200) {
        if (currentPage === 1) {
          setExploreData(res?.payload?.data?.market_place?.data);
        }
        setAllDataOfExploreBuyNsellReq(res?.payload?.data);

        // Remove duplicates from new data
        const newData = res?.payload?.data?.market_place?.data || [];
        const newDataIds = new Set(newData.map((item) => item.id));
        const filteredData = exploreData.filter(
          (item) => !newDataIds.has(item.id)
        );

        // Combine filtered data with new data
        const combinedData = [...filteredData, ...newData];
        setExploreData(combinedData);

        setLoading(false);
        setLoadingMore(false);

        setLastPage(res?.payload?.data?.market_place?.last_page);
      } else {
        setLoading(false);
        console.log("Error in BuyNsell Saga", res);
      }
    } catch (error) {
      console.log("saga error -- ", error.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!filterData && !sub_categories) {
      explore && exploreBuyNsellReq();
    } else if (!isEnabled) {
      getFilterDataApiRequest();
    } else {
      explore && exploreBuyNsellReq();
    }
  }, [filterData, currentPage, explore]);

  const onPressExplore = () => {
    setExplore(true);
  };
  const onPressMyListing = () => {
    setListing(true);
    setExplore(false);
  };
  const onPressBack = () => {
    {
      sub_categories || fromDrawer
        ? navigation.goBack()
        : navigation.navigate("Settings");
    }
  };
  const handleLoadMoreData = () => {
    if (currentPage < lastPage && !loadingMore) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getParentCategoriesRequest = () => {
    dispatch(
      getBuyNsellParentCategories({
        token: userToken,
      })
    );
  };

  useEffect(() => {
    getParentCategoriesRequest();
  }, []);

  const onPressGetNewData = (val) => {
    setNewDataApiCall(true);
    {
      currentPage == 1 && exploreBuyNsellReq();
    }
    setExploreData([]);
    setCurrentPage(1);
  };

  const onPressEditDeleteModel = (item, draft) => {
    setItemId(item?.encrypted_id);
    setItemDataYourAds(item);
    setEditDeleteModal(true);
  };

  const onPressEditModal = (item) => {
    setEditDeleteModal(false);
    setTimeout(() => {
      if (item?.add_in_draft !== 1) {
        setIsEditItem(true);
      } else {
        setIsEditItemForDraft(true);
      }
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

  const onPressAddFavorite = async (item, favorite) => {
    const formData = new FormData();
    formData.append("item_id", item?.encrypted_id);
    const handle = item.favorite_item == null ? "favorite" : "unfavoribal";
    formData.append("handle", handle);

    try {
      const res = await postStatusApiCall({
        route: "buynsell/faverite_item",
        verb: "POST",
        token: userToken,
        body: formData,
      });
      if (res?.responseCode === 200) {
        // Update exploreData with the updated favorite status
        const updatedData = exploreData.map((dataItem) => {
          if (dataItem.id === item.id) {
            return {
              ...dataItem,
              favorite_item: handle === "favorite" ? 1 : null,
            };
          }
          return dataItem;
        });
        setExploreData(updatedData);
        Toast.show(res?.message);
      } else {
        Toast.show(res?.message);
      }
    } catch (e) {
      console.log("saga update error----- ", e.toString());
    }
  };

  const onPresRemoveItemApiRequest = async () => {
    setDeleteModal(false);
    try {
      const res = await withoutStringiApiCall2({
        route: `buynsell/item/destroy/${itemId}`,
        verb: "GET",
        token: userToken,
      });

      if (res?.responseCode === 200) {
        const updatedData = exploreData.filter(
          (item) => item.encrypted_id !== itemId
        );
        setExploreData(updatedData);
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
    if (val === "deactivate") {
      formData.append("status", "inactive");
    } else if (val === "sold") {
      formData.append("status", "sold");
    } else {
      formData.append("status", "active");
    }

    try {
      const res = await postStatusApiCall({
        route: `buynsell/item/change_status/${itemId}`,
        verb: "POST",
        token: userToken,
        body: formData,
      });
      if (res?.responseCode === 200) {
        const updatedData = exploreData.filter(
          (item) => item.encrypted_id !== itemId
        );
        setExploreData(updatedData);
        Toast.show(res?.message);
      } else {
        Toast.show(res?.message);
      }
    } catch (e) {
      console.log("saga update error----- ", e.toString());
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = () => {
    dispatch(
      fetchEditProf({
        token: userToken,
        name: user?.name,
      })
    );
  };
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => {
            onPressBack();
          }}
        >
          <Image
            style={[
              styles.backIcon,
              { transform: [{ rotate: isRTL ? "180deg" : "0deg" }] },
            ]}
            source={IMAGES.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.headerSubContainer}>
          <Image source={IMAGES.buyNsell} style={styles.buyNsellLogo} />
          <Header>
            {CategoriesTitle ? t(CategoriesTitle) : t("buyNsell")}
          </Header>
        </View>
        {/* {explore ? (
          <TouchableOpacity>
            <Image
              source={IMAGES.searchIcon}
              style={[styles.addIcon, { height: getHeight(3.5) }]}
            />
          </TouchableOpacity>
        ) : ( */}
        <View style={[styles.addIcon, { height: getHeight(3.5) }]}></View>
        {/* )} */}

        <TouchableOpacity
          onPress={() => {
            setIsCreateItem(true);
          }}
        >
          <Image
            source={IMAGES.add}
            style={[styles.addIcon, { marginLeft: 10 }]}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.tabSwitchContainer}>
        <TopTabs
          onExplorePress={() => {
            onPressExplore();
          }}
          onPressMyListing={() => {
            onPressMyListing();
          }}
          buyNsell
        />
        {explore && !sub_categories && (
          <View style={styles.toggleButton}>
            <CustomSwitchLocation
              isEnabled={isEnabled}
              toggleSwitch={onPressLocationToggle}
              setIsEnabled={setIsEnabled}
            />
          </View>
        )}
      </View>

      {explore ? (
        <ExploreComponent
          data={exploreData}
          navigation={navigation}
          loading={loading}
          handleLoadMore={() => {
            handleLoadMoreData();
          }}
          onPressEditDeleteModel={(item) => {
            onPressEditDeleteModel(item);
          }}
          onPressFavorite={(item) => {
            onPressAddFavorite(item);
          }}
          allExploreData={allDataOfExploreBuyNsellReq}
          filterDataParams={filterDataParams}
          sub_categories={sub_categories}
          renderFooter={renderFooter}
        />
      ) : (
        <MyListingComponent
          yourAdsData={yourAdsData?.data}
          yourDrafts={yourDrafts?.data}
          yourFavorites={yourFavorites?.data}
          navigation={navigation}
          loading={loading}
          newDataApiCall={newDataApiCall}
          setNewDataApiCall={setNewDataApiCall}
          onPressEditDeleteModel={(item, e) => {
            onPressEditDeleteModel(item, e);
          }}
          onPressFavoriteItem={(item) => {
            onPressAddFavorite(item, "favorite");
          }}
          setSearchText={(e) => {
            setSearchText(e);
          }}
        />
      )}
      {isCreateItem && (
        <CreateItemComponent
          isVisible={isCreateItem}
          onDismiss={setIsCreateItem}
          onPressGetNewData={(val) => {
            onPressGetNewData(val);
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
          itemId={itemId}
        />
      )}

      {isEditItemForDraft && (
        <EditItemForDraftComponent
          isVisible={isEditItemForDraft}
          onDismiss={setIsEditItemForDraft}
          onPressGetNewData={(val) => {
            onPressGetNewData(val);
          }}
          itemId={itemId}
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
          item={itemDataYourAds}
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
    </SafeAreaView>
  );
};

export default BuyNsellScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  headerSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: getWidth(65),
    justifyContent: "center",
    paddingLeft: 25,
  },
  addIcon: {
    height: HP(4),
    width: WP(8),
    resizeMode: "contain",
  },
  buyNsellLogo: {
    height: getHeight(6),
    width: getWidth(8),
    resizeMode: "contain",
    margin: 5,
    marginTop: 8,
  },
  backIcon: {
    height: HP(3),
    resizeMode: "contain",
  },
  tabSwitchContainer: {
    alignItems: "center",
    flexDirection: Platform.OS === "android" && isRTL ? "row-reverse" : "row",
    justifyContent: "space-between",
  },
  toggleButton: { position: "absolute", right: 0 },
});
