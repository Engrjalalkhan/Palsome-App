import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState, useRef } from "react";
import { Modal, RefreshControl } from "react-native";
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
import { HP, WP } from "../../../../Utils/Resposive";
import Ionicons from "react-native-vector-icons/Ionicons";

import MyHeader from "../../../Components/MyHeader";
import { useTranslation } from "react-i18next";

import {
  getUserAlbumMedia,
  setUserAlbumMedia,
} from "../../../Redux/actions/NewsFeedActions";
import { SITE_URL } from "../../../Services/Constants";
import {
  getWalletPreviewData,
  setWalletPreviewData,
} from "../../../Redux/actions/WalletActions";
import WalletImageViewModal from "./WalletImageViewModal";
import WalletUploadModal from "./WalletUploadModal";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import Loader from "../../../Components/Loader";
import EditDeleteAlbum from "./EditDeleteAlbumModal";
import GestureRecognizer from "react-native-swipe-gestures";
import { ICONS } from "../../../Constants/Icons";
import RNFetchBlob from "rn-fetch-blob";
import {
  postStatusApiCall,
  withoutStringiApiCall2,
} from "../../../Services/Apis";
import SimpleToast from "react-native-simple-toast";

const data = [
  {},
  {
    post_file_type: "pdf",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "image",
    img: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
  },
  {
    post_file_type: "doc",
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
    post_file_type: "docx",
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
const ViewWallet = ({ route }) => {
  const item_id = route?.params?.item_id;
  const { t } = useTranslation();
  const itemEncryptedId = route?.params?.encrypted_id;
  const Wallet_file_tiltle = route?.params?.file_tiltle;
  const Wallet_description = route?.params?.description;
  const Existing_Files = route?.params?.files;
  const encrypted_id = route?.params?.encrypted_id;
  const file_tiltle = route?.params?.file_tiltle;
  const [containsVideo, setcontainsVideo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [noPosts, setNoPosts] = useState(true);
  const [addItem, setAddItem] = useState(true);
  const [longPressedItem, setLongPressedItem] = useState();
  const [longPressedIndex, setLongPressedIndex] = useState();
  const [myWalletdata, setMyWalletData] = useState(Existing_Files);
  const [noPostText, setNoPostText] = useState(" No files to show ");
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const token = useSelector((state) => state.auth.userToken);
  const walletToken = useSelector((state) => state.walletRed.walletToken);
  const walletPreviewData = useSelector(
    (state) => state.walletRed.walletPreviewData?.data?.walletItem?.files
  );

  // if (walletPreviewData == undefined) {
  //   setWalletPreviewData(Existing_Files);
  // }
  // const walletPreviewId = walletPreviewData[0]?.wallet_item_id;
  // const Existing_File_Paths = Existing_Files.map((item) => item.file_path);

  const onPressImage = (item) => {
    navigation.navigate("WalletImageView", { item });
  };

  const onPressVideo = (item) => {
    // console.log(item);
    // navigation.navigate("VideoFullViewScreen", item);
  };

  const onPressPdf = (item) => {
    navigation.navigate("WalletPdfView", { item });
  };

  const onPressDoc = (item) => {
    // console.log(item);

    navigation.navigate("WalletDocxView", { item });
  };

  const onItemAdd = (item) => {
    setShowUploadModal(true);
    // if (showUploadModal == false) {
    //   setMyWalletData();
    // }
    // setIsLoading(true);
  };

  const onSwipeRight = () => {
    // Handle swipe from right
  };

  const onSwipeLeft = () => {
    navigation.goBack();
  };

  const getAlbums = () => {
    dispatch(
      getWalletPreviewData({
        item_id: item_id,
        token,
        setIsLoading: setIsLoading,
        walletToken: walletToken,
      })
    );
  };

  useEffect(() => {
    getAlbums();
  }, [walletPreviewData == undefined]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   walletPreviewData?.length
  //     ? setMyWalletData([{}, ...walletPreviewData])
  //     : null;
  //   return () => dispatch(setWalletPreviewData({}));
  // }, [walletPreviewData]);

  const Title = ({ title }) => {
    return (
      <View
        style={{
          width: "94%",
          backgroundColor: "white",
          paddingHorizontal: 4,
          paddingVertical: HP(0.5),
        }}
      >
        <Text>{title}</Text>
      </View>
    );
  };

  const emptyComponent = () => {
    return (
      <View style={styles.noFileContainer}>
        <Text style={{ fontSize: 23, color: COLORS.darkGray }}>
          {noPostText}
        </Text>
      </View>
    );
  };

  const deleteSingleMedia = async (encryptedId) => {
    const response = await withoutStringiApiCall2({
      route: `wallet/item/file/${encryptedId}/delete?wallet_api_token=${walletToken}`,
      verb: "DELETE",
      token: token,
      // body: formData,
    });
    console.log("File deleted successfully", response);
  };

  const handlerLongClick = (item, index) => {
    //handler for Long Click
    // setShowMenuModal(true);
    setLongPressedItem(item);
    setLongPressedIndex(index);
    setModalVisible(true);
  };

  const onPressDelete = (item) => {
    // deleteSingleMedia(item.encrypted_id);
    deleteSingleMedia(item.encrypted_id).then(() => {
      setWalletPreviewData((images) =>
        images.filter((i) => i.encrypted_id !== item.encrypted_id)
      );
      SimpleToast.show("File Deleted Successfully");
    });
    setModalVisible(false);
    getAlbums();
  };
  const updateCover = async (fileId) => {
    const response = await withoutStringiApiCall2({
      route: `wallet/item/updateCover?wallet_api_token=${walletToken}&wallet_item_id=${itemEncryptedId}&item_file_id=${fileId}`,
      verb: "POST",
      token: token,
      // body: formData,
    });
    if (response.responseCode == 200) {
      console.log("single media Cover>>>>>> :", response);
      SimpleToast.show("Item cover updated successfully.");
    } else {
      SimpleToast.show("Error updating cover.");
    }
  };

  const makeCover = (item) => {
    const fileId = item?.encrypted_id;
    updateCover(fileId);
    setModalVisible(false);
  };

  const downloadImage = async (item) => {
    // setDisableButton(true);
    RNFetchBlob.config({
      fileName: "HelloWorld",
      fileCache: true,
      appendExt: "jpeg" || "png" || "jpg" || "gif",
      title: "file.jpg" || "file.png" || "file.jpeg" || "file.gif",
      notification: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${RNFetchBlob.fs.dirs.DownloadDir}/${item?.file_path}`,
        description: "File downloaded by download manager.",
        mime: "image/jpg" || "image/png" || "image/jpeg" || "image/gif",
      },
    })
      .fetch("GET", `${SITE_URL}${item?.file_path}`)
      .then((res) => {
        // console.log("Res::>> ", res);

        if (Platform.OS === "ios") {
          RNFetchBlob.ios.previewDocument(res.data);
          // RNFetchBlob.ios.openDocument(res.data);
        }

        console.log("The file saved to ", res.path());
      })
      .catch((err) => {
        // alert("Something went wrong");
        SimpleToast.show("Downloading canceled");

        console.log("Error::>> ", err);
      });
    SimpleToast.show("Downloading...");
    setModalVisible(false);

    // setDisableButton(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MyHeader heading={file_tiltle} />
      {isLoading ? (
        <Loader />
      ) : (
        <FlatList
          style={{ flex: 1 }}
          data={[
            // add the "Add item to wallet" button as the first item in the array
            {
              id: "add-item-button",
              type: "add-item-button",
            },
            ...(walletPreviewData == undefined
              ? Existing_Files
              : walletPreviewData || []),
          ]}
          numColumns={3}
          contentContainerStyle={styles.contentContainerStyle}
          columnWrapperStyle={styles.columnWrapperStyle}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={emptyComponent}
          ListFooterComponent={() => <View style={{ height: HP(5) }} />}
          renderItem={({ item, index }) => {
            if (item.type === "add-item-button")
              return (
                <TouchableOpacity style={styles.firstItem} onPress={onItemAdd}>
                  <Ionicons
                    name="ios-add-circle-outline"
                    size={HP(3.5)}
                    color={COLORS.primary}
                  />
                  <Text style={styles.walletItemTitle}>
                    {t("Add Item to Wallet")}
                  </Text>
                  <Text style={styles.walletItemDets}>
                    {t("It only takes a few minutes!")}
                  </Text>
                </TouchableOpacity>
              );
            return (
              <>
                {item.file_path?.includes(".jpeg") ||
                item.file_path?.includes(".jpg") ||
                item.file_path?.includes(".png") ? (
                  <TouchableOpacity
                    // delayLongPress={30}
                    onLongPress={() => handlerLongClick(item, index)}
                    activeOpacity={0.6}
                    onPress={() => onPressImage(item)}
                    style={styles.elevation}
                  >
                    <FastImage
                      source={{
                        uri: `${SITE_URL}${item?.file_path}`,
                      }}
                      style={styles.imgContainerStyle}
                    />
                    <Title title={item?.file_title} />
                  </TouchableOpacity>
                ) : item.file_path?.includes(".pdf") ? (
                  <TouchableOpacity
                    onLongPress={() => handlerLongClick(item, index)}
                    activeOpacity={0.6}
                    onPress={() => onPressPdf(item)}
                    style={styles.elevation}
                  >
                    {/* {containsVideo ? null : setcontainsVideo(true)} */}
                    <View style={styles.imgContainerStyle}>
                      <FastImage
                        source={IMAGES.pdfFile}
                        style={styles.pdfImgStyle}
                      />
                    </View>
                    <Title title={item?.file_title} />
                  </TouchableOpacity>
                ) : item.file_path?.includes(".doc") ||
                  item.file_path?.includes(".docx") ||
                  item.file_path?.endsWith(".") ? (
                  <TouchableOpacity
                    onLongPress={() => handlerLongClick(item, index)}
                    activeOpacity={0.6}
                    onPress={() => onPressDoc(item)}
                    style={styles.elevation}
                  >
                    {/* {containsVideo ? null : setcontainsVideo(true)} */}
                    <View style={styles.imgContainerStyle}>
                      <FastImage
                        source={IMAGES.wordFile}
                        style={styles.docImgStyle}
                      />
                    </View>
                    <Title title={item?.file_title} />
                  </TouchableOpacity>
                ) : null}
                {modalVisible && (
                  <GestureRecognizer
                    onSwipeDown={() => setModalVisible(false)}
                    style={styles.container}
                  >
                    <Modal
                      isVisible={modalVisible}
                      onBackdropPress={() => setModalVisible(false)}
                      onSwipeComplete={() => setModalVisible(false)}
                      swipeDirection={["down"]}
                      animationType="slide"
                      style={styles.bottomView}
                      transparent={true}
                      onRequestClose={() => setModalVisible(false)}
                    >
                      <>
                        <View>
                          <TouchableOpacity
                            style={styles.topView}
                            onPress={() => setModalVisible(false)}
                          >
                            <Text>Hello</Text>
                          </TouchableOpacity>
                          <View style={styles.dividerView}>
                            <View style={styles.dividerLine} />
                          </View>
                          <View style={styles.bottomView}>
                            <TouchableOpacity
                              style={styles.IconTextContainer}
                              onPress={() =>
                                makeCover(longPressedItem, longPressedIndex)
                              }
                            >
                              {/* {ICONS.antDesign("edit", COLORS.blue, 24)} */}
                              <FastImage
                                source={IMAGES.walletCover}
                                style={{ width: 30, height: 30 }}
                              />
                              <Text style={styles.modalText}>
                                {t("Make This File Cover")}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.IconTextContainer}
                              onPress={() =>
                                onPressDelete(longPressedItem, longPressedIndex)
                              }
                            >
                              {ICONS.antDesign("delete", COLORS.red, 24)}
                              <Text style={styles.modalText}>
                                {" "}
                                {t("Remove File")}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.IconTextContainer}
                              onPress={() =>
                                downloadImage(longPressedItem, longPressedIndex)
                              }
                            >
                              {ICONS.entypo("download", COLORS.primary, WP(7))}
                              <Text style={styles.modalText}>
                                {t("Download")}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </>
                    </Modal>
                  </GestureRecognizer>
                )}
              </>
            );
          }}
        />
      )}

      {showUploadModal && (
        <WalletUploadModal
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          addItem={addItem}
          item_id={item_id}
          file_title={Wallet_file_tiltle}
          description={Wallet_description}
          Existing_Files={Existing_Files}
          encrypted_id={encrypted_id}
          // updateWalletPreviewData={mywalletPreviewData}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  imgContainerStyle: {
    height: WP(30.7),
    width: WP(30.7),
    marginRight: WP(2),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.black,
  },
  firstItem: {
    height: WP(30.8),
    width: WP(30.7),
    marginRight: WP(2),
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
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
  docImgStyle: { height: WP(21.7), width: WP(23.7) },
  pdfImgStyle: { height: WP(21.7), width: WP(17.7) },
  elevation: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  walletItemTitle: {
    fontWeight: "bold",
    fontSize: WP(2.5),
  },
  walletItemDets: {
    fontSize: WP(2),
    marginLeft: 9,
  },
  noFileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: COLORS.transparent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },

  modalContainer: {
    flex: 1,
  },

  topView: {
    height: HP(75),
    backgroundColor: COLORS.black,
    opacity: 0.7,
  },
  bottomView: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
    height: HP(22),
    justifyContent: "space-around",
  },
  dividerLine: {
    height: 5,
    backgroundColor: COLORS.white,
    width: WP(20),
    alignSelf: "center",
    marginTop: -25,
    borderRadius: 10,
  },
  dividerView: {
    backgroundColor: COLORS.black,
    marginBottom: -13,
  },
  modalText: {
    fontSize: 19,
    marginLeft: 13,
  },
  IconTextContainer: { flexDirection: "row", padding: 12 },
});
export default ViewWallet;
