import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
  FlatList,
  View,
  TouchableOpacity,
  Image,
  Text,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getHeight } from "../../../../Utils/NewResponsive";
import { ACTIONS } from "../../../Redux/action-types";
import { fetchSinglePost } from "../../../Redux/actions/NewsFeedActions";
import { COLORS } from "../../../Constants/Colors";
import RenderItemSinglePost from "../../../Components/SinglePostRenderItem/RenderItemSinglePost";
import RenderItemSingleReel from "../../../Components/SinglePostRenderItem/RenderItemSingleReel";
import { withoutStringiApiCall2 } from "../../../Services/Apis";

const SingleReel = ({ navigation, route }) => {
  const token = useSelector((state) => state.auth.userToken);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  //   useEffect(() => {
  //     setData(singlePost?.singlePost?.data);
  //     // console.log("no post exist", singlePost);
  //   }, [singlePost]);
  //   useEffect(() => {
  //     dispatch(
  //       fetchSinglePost({ token, url: route.params.url, setLoading: setLoading })
  //     );
  //   }, []);

  const selectedReelAPI = async (item) => {
    // try {
    const response = await withoutStringiApiCall2({
      //   route: `reel/${props.route.params.item}`,
      route: `reel/${route.params.newUrl}`,
      verb: "GET",
      token: token,
    });
    console.log("selectedReelAPI response>>>>>> :", response.payload.data);
    const myDATA = response.payload.data;
    setData(myDATA);
  };
  selectedReelAPI();

  // useEffect(() => {
  //   selectedReelAPI();
  // }, []);

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            dispatch({ type: ACTIONS.SET_SINGLE_POST, singlePost: null });
            // setLoading(false);
          }}
          style={{
            justifyContent: "center",
            marginLeft: widthPercentageToDP("4"),
          }}
        >
          <Ionicons name="arrow-back" color="white" size={30} />
        </TouchableOpacity>
        <View style={styles.srchIcon}>
          <Ionicons name="search" color="white" size={30} />
        </View>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          style={{
            flex: 1,
            // margin: getHeight(0.3),
            // paddingTop: getHeight(1),
          }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={data}
          ListEmptyComponent={
            <>
              {loading ? (
                <ActivityIndicator
                  animating={loading}
                  size="large"
                  color={COLORS.primary}
                />
              ) : (
                <View style={styles.noPostsContainer}>
                  <Text style={{ fontSize: 23, color: COLORS.grey }}>
                    Post Deleted
                  </Text>
                </View>
              )}
            </>
          }
          renderItem={({ item, index }) => (
            // console.log("item singlepost>>>", item),
            <RenderItemSingleReel
              item={item}
              index={index}
              data={data}
              setData={setData}
            />
          )}
          keyExtractor={(item, index) => index}
        />
      </View>
    </SafeAreaView>
  );
};

export default SingleReel;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    // backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: heightPercentageToDP("2"),
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    flex: 0.1,
  },
  srchIcon: {
    marginRight: widthPercentageToDP("5"),
    justifyContent: "center",
  },
  image: {
    resizeMode: "center",
  },
  listitem: {
    marginVertical: heightPercentageToDP("0.7"),
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
});
