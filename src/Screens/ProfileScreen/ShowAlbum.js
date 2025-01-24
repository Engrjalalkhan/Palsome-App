import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl } from "react-native";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useDispatch, useSelector } from "react-redux";
import { WP } from "../../../Utils/Resposive";
import CustomPlayIcon from "../../Components/CustomPlayIcon";
import MyHeader from "../../Components/MyHeader";
import { COLORS } from "../../Constants/Colors";
import {
  getUserAlbumMedia,
  setUserAlbumMedia,
} from "../../Redux/actions/NewsFeedActions";
import { SITE_URL } from "../../Services/Constants";
import { withoutStringiApiCall } from "../../Services/Apis";
import Loader from "../../Components/Loader";
import { Image } from "react-native";

const data = [
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
];
const ShowAlbum = ({ route }) => {
  const NavParams = route?.params;
  const userName = NavParams?.user_name;
  const userData = useSelector((state) => state.auth.userData);

  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.userToken);
  const userAlbumMedia = useSelector(
    (state) => state.blackNewsF.userAlbumMedia
  );
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [lastPage, setLastPage] = useState([]);
  const [containsVideo, setcontainsVideo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const OnPressImage = (index) => {
    navigation.navigate("AlbumPhotoSwiper", {
      data: data,
      initialIndex: index,
      containsVideo: containsVideo,
    });
  };

  const onPressVideo = (item, index) => {
    // console.log(item);
    navigation.navigate("VideoFullViewScreen", {
      item: item,
      isProfile: true,
      userName: userName,
      videoIndex: index,
      data: data,
    });
  };
  // const getAlbums = () => {
  //   dispatch(
  //     getUserAlbumMedia({
  //       user_name: userData.name,
  //       encrypted_id: NavParams?.encrypted_id,
  //       token,
  //       setIsLoading: setIsLoading,
  //       currentPage: currentPage,
  //     })
  //   );
  // };

  const getAlbumsPhotos = async (type) => {
    setLoadingMore(true);
    const albumName = `album_${type}_pic`;
    const response = await withoutStringiApiCall({
      route: `${userName}/${albumName}?page=${currentPage}`,
      verb: "GET",
      token: token,
    });
    setLastPage(response?.payload?.data?.album_medias?.last_page);
    setData([...data, ...response?.payload?.data?.album_medias?.data]);
    setLoadingMore(false);
  };

  useEffect(() => {
    // console.log("in useeff of album media");
    return () => dispatch(setUserAlbumMedia({}));
  }, []);
  useEffect(() => {
    if (NavParams.post_type === "profile_picture") {
      getAlbumsPhotos("profile");
    } else if (NavParams.post_type === "profile_cover_picture") {
      getAlbumsPhotos("cover");
    } else if (NavParams.timelinePhotosAlbum_count) {
      getAlbumsPhotos("timeline");
    } else if (NavParams.album_name) {
      setData(NavParams?.media.map((media) => media));
    }
  }, [currentPage]);

  const handleLoadMore = useCallback(() => {
    {
      currentPage <= lastPage && setCurrentPage(currentPage + 1);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <MyHeader
        goBack={() => navigation.goBack()}
        heading={`${
          NavParams?.post_type == "profile_picture"
            ? "Profile Pictures"
            : NavParams?.post_type == "profile_cover_picture"
            ? "Cover Pictures"
            : NavParams?.album_name
            ? NavParams?.album_name
            : "Timeline Pictures"
        }`}
      />
      <FlatList
        style={{ flex: 1 }}
        data={data}
        numColumns={3}
        onEndReached={() => {
          handleLoadMore();
        }}
        ListFooterComponent={
          <View style={styles.footerContainerStyle}>
            {loadingMore && <Loader />}
          </View>
        }
        onEndReachedThreshold={0.2}
        contentContainerStyle={styles.contentContainerStyle}
        columnWrapperStyle={styles.columnWrapperStyle}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <>
            {isLoading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : null}
          </>
        }
        renderItem={({ item, index }) => {
          return (
            <>
              {item?.post_file_type == "image" ? (
                <View>
                  <TouchableOpacity onPress={() => OnPressImage(index)}>
                    <FastImage
                      source={{
                        uri: SITE_URL + item?.path,
                      }}
                      style={styles.imgContainerStyle}
                    />
                  </TouchableOpacity>
                </View>
              ) : item?.post_file_type === "palsome_ai" ? (
                <View>
                  <TouchableOpacity onPress={() => OnPressImage(index)}>
                    <Image
                      source={{
                        uri: SITE_URL + item?.path,
                      }}
                      style={styles.imgContainerStyle}
                    />
                  </TouchableOpacity>
                </View>
              ) : item?.post_file_type === "post" ? (
                <TouchableOpacity onPress={() => OnPressImage(index)}>
                  <Image
                    source={{
                      uri: item?.path,
                    }}
                    style={styles.imgContainerStyle}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => OnPressImage(index)}>
                  {containsVideo ? null : setcontainsVideo(true)}

                  <FastImage
                    source={{
                      uri:
                        SITE_URL +
                        "converted_videos/thumbnails/" +
                        item?.thumb_path,
                    }}
                    style={styles.imgContainerStyle}
                  >
                    <CustomPlayIcon
                      sizeCicle={WP(10)}
                      sizeIcon={WP(4)}
                      onPress={() => OnPressImage(index)}
                    />
                  </FastImage>
                </TouchableOpacity>
              )}
            </>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  imgContainerStyle: {
    height: WP(32.7),
    width: WP(30.7),
    marginRight: WP(2),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  contentContainerStyle: { marginTop: WP(2) },
  columnWrapperStyle: { marginLeft: WP(2), marginBottom: WP(2) },
  addNewContainerStyle: { justifyContent: "center", alignItems: "center" },
  addBtn: {
    width: 28,
    height: 28,

    borderRadius: 100,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  addTxt: { fontSize: 14, fontFamily: "Roboto-Bold", textTransform: "none" },
  footerContainerStyle: {
    marginBottom: 10,
    height: 30,
    marginTop: 10,
  },
});
export default ShowAlbum;
