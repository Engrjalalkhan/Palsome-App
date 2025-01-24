import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { HP, WP } from "../../../../Utils/Resposive";
import MyHeader from "../../../Components/MyHeader";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import WalletUploadModal from "./WalletUploadModal";
import { withoutStringiApiCall2 } from "../../../Services/Apis";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteWalletToken,
  getWalletData,
  refreshWallet,
} from "../../../Redux/actions/WalletActions";
import { SITE_URL } from "../../../Services/Constants";
import { imgRegex } from "../../../../Utils/Regexes/imgVideoRegex";
import Entypo from "react-native-vector-icons/Entypo";
import EditDeleteAlbum from "./EditDeleteAlbumModal";
import { ActionCreators } from "redux-devtools";
import { timeDifferenceComments } from "../../../Components/NewsFeedList/Functions";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";
import { ICONS } from "../../../Constants/Icons";
import { Swipeable } from "react-native-gesture-handler";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const WalletListHeader = ({ onPress }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.walletHeaderBox} onPress={onPress}>
      <Ionicons
        name="ios-add-circle-outline"
        size={HP(3.5)}
        color={COLORS.primary}
      />
      <Text style={styles.walletItemTitle}>{t("Add Item to Wallet")}</Text>
      <Text style={{ marginLeft: -4, fontSize: WP(3) }}>
        {t("It only takes a few minutes!")}
      </Text>
    </TouchableOpacity>
  );
};
const WalletItem = ({
  item,
  index,
  userWalletData,
  setuserWalletData,
  setShowUploadModal,
}) => {
  // console.log("iamge path", `${SITE_URL}${item.files[0].file_path}`);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [lastOpenedTime, setLastOpenedTime] = useState("");
  const [checkModalClosed, setCheckModalClosed] = useState(false);
  const [itemToUdate, setItemToUdate] = useState();
  const { t } = useTranslation();

  // console.log("item", item);

  const item_id = item.id;
  // const file_tiltle = item.file_tiltle;
  // console.log("Item in Wallet Home::>>", item);
  // console.log("item_id", item_id);

  const navigation = useNavigation();
  const coverFile = item.files.find((file) => file.is_wallet_items_cover === 1);
  const noCoverFile = item.files.find(
    (file) => file.is_wallet_items_cover === 0
  );
  const pdfCoverFile = item?.files[0]?.is_wallet_items_cover === 1;
  const noPdfCoverFile = item?.files[0]?.is_wallet_items_cover === 0;
  const onPressItem = () => {
    navigation.navigate("ViewWallet", {
      item_id: item_id,
      file_tiltle: item?.title,
      description: item?.description,
      files: item?.files,
      encrypted_id: item?.encrypted_id,
    });
  };

  const checkFileType = (item) => {
    for (let i = 0; i < item.files.length; i++) {
      if (item.files.length > 0) {
        if (item.files?.[i].file_path.match(imgRegex)) {
          if (item.files?.[i].file_path.indexOf() !== -1) {
            continue;
          } else {
            return true;
          }
        } else if (item.files?.[i].file_path.endsWith(".pdf")) {
          return "pdf";
        } else {
          return false;
        }
      }
    }
  };

  const fileType = checkFileType(item);

  // const lastOpened = (item) => {
  //   // let date = new Date(item.updated_at);
  //   // let today = new Date();
  //   // let diff = today - date;
  //   // let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  //   // if (diffDays == 0) {
  //   //   return "Today";
  //   // } else if (diffDays == 1) {
  //   //   return "Yesterday";
  //   // } else {
  //   //   return `${diffDays} days ago`;
  //   // }
  // };

  const onDotMenuPress = () => {
    // alert("Hello");
    setShowMenuModal(true);
  };
  // useEffect(() => {
  //   if (itemToUdate) {
  //     setShowUpdateModal(true);
  //   }
  // }, [itemToUdate]);

  const lastOpened = (item) => {
    const lastOpened = timeDifferenceComments(item.updated_at);
    setLastOpenedTime(lastOpened);
  };

  useEffect(() => {
    lastOpened(item);
  }, []);

  return (
    <>
      <TouchableOpacity style={styles.walletItem} onPress={onPressItem}>
        <FastImage
          source={
            coverFile && fileType !== "pdf"
              ? { uri: `${SITE_URL}${coverFile.file_path}` }
              : fileType === true
              ? { uri: `${SITE_URL}${item?.files[0]?.file_path}` }
              : pdfCoverFile && fileType === "pdf"
              ? IMAGES.pdfFile
              : noPdfCoverFile
              ? { uri: `${SITE_URL}${coverFile?.file_path}` }
              : fileType === "pdf"
              ? IMAGES.pdfFile
              : IMAGES.standard
          }
          style={styles.itemImg}
          resizeMode={
            item.post_file_type == "image" || fileType === true
              ? "cover"
              : "contain"
          }
        />
        <View style={styles.walletItemdetailBox}>
          <Text style={styles.walletItemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.walletItemDets}>
            {t("Last updated")}: {lastOpenedTime}
          </Text>
          <Text style={styles.walletItemDets}>
            {item.numOfFiles} {t("Files")}: {item.files_count}
          </Text>
          <Text style={styles.walletItemDisc} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>

      <Pressable style={styles.threeDotContainer} onPress={onDotMenuPress}>
        {ICONS.entypo("dots-three-horizontal", null, 24, COLORS.primary)}
      </Pressable>

      {showMenuModal && (
        <EditDeleteAlbum
          modalVisible={showMenuModal}
          setModalVisible={setShowMenuModal}
          item={item}
          t={t}
          userWalletData={userWalletData}
          setuserWalletData={setuserWalletData}
          onPressEdit={() => {
            console.log("edit press");
            setShowMenuModal(false);
            setItemToUdate(item);
            setTimeout(() => {
              setShowUpdateModal(true);
            }, 0);
          }}
        />
      )}

      {showUpdateModal && (
        <WalletUploadModal
          showUploadModal={showUpdateModal}
          setShowUploadModal={setShowUpdateModal}
          addItem={true}
          edit={true}
          file_title={item?.title}
          description={item?.description}
          Existing_Files={item?.files}
          encrypted_id={item?.encrypted_id}
        />
      )}
    </>
  );
};
const WalletHome = (props) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [userWalletData, setuserWalletData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [noWallet, setNoWallet] = useState(true);
  const [noWalletText, setNoWalletText] = useState(
    "Created wallet will appear here"
  );
  const resfresh = useSelector((state) => state.walletRed.refresh);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);
  const walletToken = useSelector((state) => state.walletRed.walletToken);
  const updateWalletData = useSelector(
    (state) => state.walletRed.walletPreviewData
  );
  const name = useSelector((state) => state.auth.userData.first_name);

  const walletData = useSelector((state) => state.walletRed.walletData);
  const walletRefresh = useSelector((state) => state.walletRed.walletRefresh);

  const navigation = useNavigation();
  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const { t } = useTranslation();

  // const files = walletData.data.wallet.items.map((item) => item.files);
  // console.log(
  //   "walet datatttttttttatatatat filessssss>>>",
  //   walletData.data.wallet.items.map((item) => item.files)
  // );

  // useEffect(() => {
  //   setuserWalletData(userWalletData);
  // }, [userWalletData]);

  const onPressLogout = () => {
    dispatch(deleteWalletToken());
    navigation.navigate("Settings");
  };
  const onPressAdd = () => {
    setShowUploadModal(true);
    dispatch(refreshWallet(false));
  };

  const getWalletDataFn = () => {
    // setLoading(false);
    dispatch(
      getWalletData({
        walletToken: walletToken,
        token: token,
        setLoading: setLoading(false),
      })
    );
  };

  useEffect(() => {
    getWalletDataFn();
  }, [updateWalletData]);

  useEffect(() => {
    setuserWalletData(walletData?.data?.wallet?.items);
    // getWalletDataFn();
  }, [walletData]);
  const onRefresh = () => {
    getWalletDataFn();
  };

  useEffect(() => {
    if (walletRefresh) {
      onRefresh();
    }
  }, [walletRefresh]);

  const endReached = () => {
    setuserWalletData(walletData?.data?.wallet?.items);
  };
  // console.log("User wallet data::::::::", userWalletData);
  const showConfirmDialog = () => {
    // setModalVisible(!modalVisible);
    return Alert.alert(
      t("Are you sure?"),
      t("Are you sure you want to logout from Wallet?"),
      [
        {
          text: t("Yes"),
          onPress: () => {
            onPressLogout();
          },
        },

        {
          text: t("No"),
        },
      ]
    );
  };
  const onSwipeRight = () => {
    navigation.goBack();
  };

  const onSwipeLeft = () => {
    navigation.goBack();
  };
  return !userWalletData ? (
    <ActivityIndicator size={30} />
  ) : (
    <View style={styles.container}>
      <MyHeader
        goBack={() => navigation.goBack()}
        heading={name + "' " + t("s Wallet")}
        rightIconName={"log-out"}
        onPressRight={showConfirmDialog}
      />
      <FlatList
        data={userWalletData}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={() => WalletListHeader({ onPress: onPressAdd })}
        refreshing={refreshing}
        onEndReached={endReached}
        ListEmptyComponent={
          <>
            {noWallet ? (
              <View style={styles.noWalletContainer}>
                <Text style={{ fontSize: 16, color: COLORS.darkGray }}>
                  {t(noWalletText)}
                </Text>
              </View>
            ) : null}
          </>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => onRefresh()}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        renderItem={({ item, index }) => (
          <WalletItem
            item={item}
            index={index}
            setuserWalletData={setuserWalletData}
            userWalletData={userWalletData}
          />
        )}
      />
      {showUploadModal && (
        <WalletUploadModal
          showUploadModal={showUploadModal}
          setShowUploadModal={setShowUploadModal}
          uploadModalType={"Add"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, marginBottom: HP(2) },
  walletItem: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    marginTop: HP(2),
    marginHorizontal: WP(5),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  itemImg: { height: HP(15), width: WP(35), backgroundColor: COLORS.black },

  walletItemdetailBox: {
    flex: 1,

    justifyContent: "space-evenly",
    marginLeft: WP(10),
    // alignItems: "center",
  },
  walletItemTitle: {
    fontWeight: "bold",
    fontSize: WP(4),
    marginRight: 10,
    textAlign: "left",
  },
  walletItemDets: {
    fontSize: WP(3),
  },
  walletItemDisc: {
    fontSize: WP(3),
    color: COLORS.black,
    marginRight: 10,
    textAlign: "left",
  },
  walletHeaderBox: {
    height: HP(10),
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    marginHorizontal: WP(5),
    justifyContent: "center",
    alignItems: "center",
  },

  noWalletContainer: {
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

  threeDotContainer: {
    position: "absolute",
    right: 25,
    top: 15,
    padding: 5,
    marginTop: -10,
  },
});
export default WalletHome;
