import { useTranslation } from "react-i18next";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Text,
  View,
  FlatList,
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useSelector } from "react-redux";

import { useNavigation, useRoute } from "@react-navigation/native";

import FastImage from "react-native-fast-image";
import Carousel from "react-native-snap-carousel";

import { COLORS } from "../../Constants/Colors";
import { SITE_URL } from "../../Services/Constants";

import { withoutStringiApiCall2 } from "../../Services/Apis";

import { ICONS } from "../../Constants/Icons";
import MyHeader from "../../Components/MyHeader";
import EnhancedImageViewing from "react-native-image-viewing";
import { actions } from "../../../Utils/DynamicBottomSheetActions";
import DynamicBottomSheet from "../../Components/DynamicBottomSheet";
import { useBackHandler } from "../../../Utils/backHardwareBackPress/handleHardBackPress";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ImageSwiperWithThumbnails = React.memo(
  ({
    data,
    carouselRef,
    activeIndex,
    setActiveIndex,
    handleLoadMore,
    thumbnailListRef,
    setIsModalVisible,
  }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(0);
    const progressBarAnimation = useRef(new Animated.Value(0)).current;

    const startProgressBar = () => {
      Animated.timing(progressBarAnimation, {
        toValue: 1,
        duration: (1 - currentProgress) * 3000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished && isPlaying) {
          const nextIndex = activeIndex + 1;
          if (nextIndex >= data.length) {
            setIsPlaying(false);
            setCurrentProgress(0);
            return;
          }
          setCurrentProgress(0);
          setActiveIndex(nextIndex);
          carouselRef.current.snapToItem(nextIndex);
          startProgressBar();
        }
      });
    };

    const pauseProgressBar = () => {
      progressBarAnimation.stopAnimation((value) => {
        setCurrentProgress(value);
      });
    };

    useEffect(() => {
      if (isPlaying) {
        startProgressBar();
      } else {
        pauseProgressBar();
      }
    }, [isPlaying]);

    useEffect(() => {
      if (isPlaying) {
        startProgressBar();
      }
    }, [activeIndex]);

    const handlePlayPause = () => {
      setIsPlaying(!isPlaying);
    };
    const scrollToThumbnail = (index) => {
      if (thumbnailListRef.current) {
        thumbnailListRef.current.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    };

    const handleSnapToItem = (index) => {
      setActiveIndex(index);
      scrollToThumbnail(index);
      progressBarAnimation.setValue(0);
      setCurrentProgress(0);
      if (isPlaying) {
        startProgressBar();
      }
    };

    const getCarouselItemLayout = (_, index) => ({
      length: screenWidth * 0.72,
      offset: screenWidth * 0.72 * index,
      index,
    });

    const renderMainImage = ({ item }) => {
      return (
        <Pressable
          onPress={() => {
            setIsModalVisible(true);
            setIsPlaying(false);
          }}
          style={styles.imageContainer}
        >
          <FastImage
            style={styles.image}
            source={{ uri: SITE_URL + item?.path }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Pressable>
      );
    };

    const renderThumbnail = ({ item, index }) => (
      <TouchableOpacity
        onPress={() => {
          setActiveIndex(index);
          carouselRef.current?.snapToItem(index, true);
        }}
      >
        <FastImage
          style={[
            styles.thumbnail,
            activeIndex === index && styles.selectedThumbnail,
          ]}
          source={{ uri: SITE_URL + item?.path }}
          resizeMode={FastImage.resizeMode.cover}
        />
      </TouchableOpacity>
    );

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          {isPlaying
            ? ICONS.antDesign("pausecircle", COLORS.primary, 34)
            : ICONS.antDesign("play", COLORS.primary, 34)}
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: progressBarAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              },
            ]}
          />
        </View>

        <Carousel
          ref={carouselRef}
          data={data}
          inactiveSlideScale={0.9}
          sliderWidth={screenWidth}
          inactiveSlideOpacity={0.7}
          renderItem={renderMainImage}
          itemWidth={screenWidth * 0.72}
          onSnapToItem={handleSnapToItem}
          getItemLayout={getCarouselItemLayout}
        />
        <FlatList
          horizontal
          data={data}
          ref={thumbnailListRef}
          style={styles.thumbnailList}
          renderItem={renderThumbnail}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `${index}`}
          onEndReached={() => handleLoadMore()}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.tooLightGrey,
  },
  imageContainer: {
    width: screenWidth - 100,
    height: screenHeight * 0.8,
    justifyContent: "center",
    alignItems: "center",
    maxHeight: screenHeight - screenWidth + 90,
    marginTop: "20%",
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    width: screenWidth - 115,
  },
  thumbnailList: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedThumbnail: {
    width: 65,
    borderColor: COLORS.primary,
  },
  yearsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  yearText: {
    // marginHorizontal: 10,
    // color: "white",
    fontSize: 16,
    position: "absolute",
  },
  playButton: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    padding: 10,
    borderRadius: 20,
    zIndex: 1000,
  },
  playButtonText: {
    color: "white",
    fontSize: 16,
  },
  progressBar: {
    // position: "absolute",
    // top: 0,
    height: 5,
    backgroundColor: COLORS.tooLightGrey,
    borderRadius: 5,
    width: "100%",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  noDataContainer: {
    borderRadius: 8,

    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // elevation: 1,
  },
  noDataText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  yearContainer: {
    height: 150,
    width: "100%",
    position: "absolute",
    top: Platform.OS == "android" ? "8%" : "14%",
    zIndex: 1000,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  yearminusContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    position: "absolute",
    // top: "2%",
  },
  ascDescContainer: {
    backgroundColor: COLORS.primary,
    height: 30,
    width: 30,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    bottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullSizeImage: {
    width: screenWidth * 0.95,
    height: screenHeight * 0.7,
    borderRadius: 8,
  },
  closeIcon: {
    position: "absolute",
    top: 60,
    right: screenWidth * 0.02,
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  closeIconText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});

const Museum = () => {
  const route = useRoute();
  const { t } = useTranslation();
  const navigation = useNavigation();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });
  const id = route.params?.id;
  const currentUser = route.params?.user;
  const moduleType = route.params?.moduleType;
  const moduleName = route.params?.moduleName;

  const isGallery = route?.params?.gallery || false;

  const carouselRef = useRef(null);
  const thumbnailListRef = useRef(null);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["18%", "18%"], []);

  const token = useSelector((state) => state?.auth?.userToken);
  const userData = useSelector((state) => state.auth.userData);

  const [data, setData] = useState([]);
  const [maxYear, setMaxYear] = useState(null);
  const [minYear, setMinYear] = useState(null);
  const [last_page, setLast_page] = useState();
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [current_page, setCurrent_page] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    getUserMuseumGalleryApi();
  }, [current_page, sortOrder, sorting]);

  const getUserMuseumGalleryApi = useCallback(async () => {
    if (loadingMore) return;

    try {
      setLoadingMore(true);
      const res = await withoutStringiApiCall2({
        route: `${
          currentUser?.name ? currentUser.name : `${moduleType}/${id}`
        }/${isGallery ? "gallery" : "museum"}?limit=12&page=${current_page}`,
        verb: "GET",
        token: token,
      });
      if (res.responseCode !== 200) {
        setLoading(false);
        console.log("Error In data museum Api", res);
      } else if (res.responseCode === 200) {
        setSortOrder(res?.payload?.data?.order);
        setLast_page(
          res?.payload?.data?.[isGallery ? "gallery" : "museum"]?.last_page
        );
        if (current_page == 1) {
          setData(res?.payload?.data?.[isGallery ? "gallery" : "museum"]?.data);
          setMaxYear(res?.payload?.data?.max_year);
          setMinYear(res?.payload?.data?.min_year);
        } else {
          const newItems =
            res?.payload?.data?.[isGallery ? "gallery" : "museum"]?.data || [];
          const { max_year: max, min_year: min } = res?.payload?.data || {};
          const filteredItems = newItems.filter(Boolean);
          const updatedDataWithMinMax = filteredItems.map((item) => ({
            ...item,
            min,
            max,
          }));

          setData((prevData) => [...prevData, ...updatedDataWithMinMax]);
          setMaxYear(res?.payload?.data?.max_year);
          setMinYear(res?.payload?.data?.min_year);
        }
      }
    } catch (e) {
      console.log("UserData in MuseumGallery error -- ", e.toString());
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setSorting(false);
    }
  });

  const postOrderApi = useCallback(async () => {
    const formData = new FormData();
    formData.append("type", isGallery ? "gallery" : "museum");
    formData.append("order", sortOrder === "asc" ? "desc" : "asc");

    try {
      const res = await withoutStringiApiCall2({
        route: `${userData?.name}/museum/update`,
        verb: "POST",
        token: token,
        params: formData,
      });
      if (res.responseCode !== 200) {
        setLoading(false);
        console.log("Error In data museum Api", res);
      } else if (res.responseCode === 200) {
        setLoading(true);
        setActiveIndex(0);
      }
    } catch (e) {
      console.log("UserData in MuseumGallery error -- ", e.toString());
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  });

  const handleLoadMore = useCallback(() => {
    if (!loadingMore & (current_page < last_page)) {
      setCurrent_page((prev) => prev + 1);
    }
  });

  const scrollEvent = (index) => {
    if (thumbnailListRef.current) {
      thumbnailListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }
  };

  const toggleSortOrder = () => {
    setData([]);
    setCurrent_page(1);
    setSorting(true);
    postOrderApi();
  };

  const getActiveYear = useMemo(() => {
    return data[activeIndex]?.created_at
      ? new Date(data[activeIndex].created_at).getFullYear()
      : null;
  }, [data, activeIndex]);

  const getVisibleYears = useMemo(() => {
    const activeYear = getActiveYear;
    const years = [minYear, maxYear];

    if (
      activeYear &&
      activeYear > minYear &&
      activeYear < maxYear &&
      !years.includes(activeYear)
    ) {
      years.splice(1, 0, activeYear);
    }

    return [...new Set(years)].sort((a, b) =>
      sortOrder === "asc" ? a - b : b - a
    );
  }, [minYear, maxYear, getActiveYear, sortOrder]);

  const handleActionPress = (label) => {
    switch (label) {
      case "Ascending":
        setSortOrder("asc");
        toggleSortOrder();
        break;
      case "Descending":
        setSortOrder("desc");
        toggleSortOrder();
        break;
      default:
    }
    bottomSheetRef.current?.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MyHeader
        goBack={() => navigation.goBack()}
        heading={`${
          currentUser?.first_name ? currentUser?.first_name : moduleName
        }'s ${isGallery ? t("Gallery") : t("Museum")}`}
        rightIconNameMuseum={"filter-variant"}
        onPressRightIconFiler={() => bottomSheetRef.current?.present()}
      />
      {loading || sorting ? (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={{ flex: 1 }}
        />
      ) : !loading && data?.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            {t(`No ${isGallery ? "gallery" : "museum"} to show`)}{" "}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.yearContainer}>
            <View style={styles.yearminusContainer}>
              {getVisibleYears?.map((year, index) => (
                <Text
                  key={index}
                  style={{
                    fontWeight: year == getActiveYear ? "bold" : "normal",
                    marginHorizontal: 5,
                    fontSize: 25,
                  }}
                >
                  {year}
                </Text>
              ))}
            </View>
          </View>

          <ImageSwiperWithThumbnails
            data={data}
            minYear={minYear}
            maxYear={maxYear}
            isGallery={isGallery}
            carouselRef={carouselRef}
            loadingMore={loadingMore}
            activeIndex={activeIndex}
            handleLoadMore={handleLoadMore}
            setActiveIndex={setActiveIndex}
            thumbnailListRef={thumbnailListRef}
            setIsModalVisible={setIsModalVisible}
          />
        </>
      )}
      <DynamicBottomSheet
        actions={actions}
        snapPoints={snapPoints}
        selectedValue={sortOrder}
        backgroundColor={COLORS.white}
        bottomSheetRef={bottomSheetRef}
        onActionPress={handleActionPress}
        tickIcon={ICONS.antDesign("check", COLORS.primary, 24)}
      />

      <EnhancedImageViewing
        imageIndex={activeIndex}
        visible={isModalVisible}
        onImageIndexChange={scrollEvent}
        onRequestClose={() => setIsModalVisible(false)}
        images={data.map((item) => ({ uri: SITE_URL + item.path }))}
      />
    </SafeAreaView>
  );
};

export default Museum;
