import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { WP } from "../../../../../Utils/Resposive";
import CreateReelsCard from "./CreateReelsCard";
import { SITE_URL } from "../../../../Services/Constants";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SeeMoreReels from "./SeeMoreReels";
import { useNavigation } from "@react-navigation/native";
import Loader from "../../../../Components/Loader";
import { COLORS } from "../../../../Constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReelsFlatList = ({ realApiData }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [reelsData, setReelsData] = useState([]);

  useEffect(() => {
    if (realApiData?.data?.length) {
      setData(realApiData?.data);
    }
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => {
      setReelsData(item);
      if (index === 0) {
        return <CreateReelsCard />;
      }
      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() =>
            navigation.navigate("ReelsNav", {
              screen: "ReelsIndex",
              params: { item: item },
            })
          }
        >
          <Image
            source={{ uri: SITE_URL + item?.media[0]?.thumb_path }}
            style={styles.img}
          />
          <View style={styles.playIconContainer}>
            <FontAwesome5 name="play" size={15} color="white" />
            {item?.reel_user_views_count > 1000 && (
              <Text style={styles.itemText}>{item?.reel_user_views_count}</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [currentPage]
  );

  const renderFooter = () => {
    if (loading || !realApiData || !realApiData.data) {
      return null;
    }
    return <SeeMoreReels reelsSeeMore={reelsData} />;
  };

  return loading ? (
    <Loader white />
  ) : (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    flexDirection: "row",
  },
  itemContainer: {
    backgroundColor: COLORS.red,
    height: 150,
    width: 90,
    marginLeft: WP(2),
    borderRadius: 15,
    borderColor: COLORS.red,
    borderWidth: 2,
    overflow: "hidden",
    alignItems: "center",
  },
  playIconContainer: {
    position: "absolute",
    bottom: 0,
    left: 25,
    right: 0,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  img: { height: 150, width: 90 },
  itemText: { color: COLORS.white, marginLeft: 5, fontWeight: "bold" },
});
export default React.memo(ReelsFlatList);
