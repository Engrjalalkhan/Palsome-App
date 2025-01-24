import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Platform,
  BackHandler,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { useSelector, useDispatch } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import { widthPercentageToDP } from "react-native-responsive-screen";

import styles from "./styles";
import RenderItemSinglePost from "../../Components/SinglePostRenderItem/RenderItemSinglePost";

import { ACTIONS } from "../../Redux/action-types";
import { fetchSinglePost } from "../../Redux/actions/NewsFeedActions";

import { COLORS } from "../../Constants/Colors";
import { getHeight } from "../../../Utils/NewResponsive";
import LogoutUserComponent from "../../Components/LogoutUserComponent";
import { isRTL } from "../../../Utils/IsRTL";

const SinglePost = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const fetchUri = route.params.url;
  const fromSplash = route?.params?.fromSplash;
  const fromSavedPost = route.params.fromSavedPost;

  const token = useSelector((state) => state.auth.userToken);
  const singlePost = useSelector((state) => state.newsF.singlePost);

  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(singlePost?.singlePost?.data);
  }, [singlePost, data]);

  useEffect(() => {
    dispatch(
      fetchSinglePost({ token, url: route.params.url, setLoading: setLoading })
    );
  }, []);

  useEffect(() => {
    const backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack();
        return true;
      }
    );

    const navListener =
      Platform.OS == "ios" && token
        ? navigation.addListener("blur", (e) => {
            fromSplash &&
              dispatch({ type: ACTIONS.HANDLE_BACK_SPLASH, data: true });
          })
        : Platform.OS == "android" && token
        ? navigation.addListener("gestureEnd", () => {
            handleBack();
            return true;
          })
        : navigation.addListener("blur", () => {
            navigation.replace("Intro");
          });

    return () => {
      backhandler.remove();
      // handleBack();

      navListener();
    };
  }, []);

  const handleBack = () => {
    if (fromSplash) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MyTopTabs" }],
      });
    } else {
      navigation.goBack();
    }

    dispatch({ type: ACTIONS.SET_SINGLE_POST, singlePost: null });
  };

  return (
    <SafeAreaView style={styles.main}>
      {token && (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleBack}
            style={{
              justifyContent: "center",
              marginLeft: widthPercentageToDP("4"),
            }}
          >
            <Ionicons
              name={isRTL ? "arrow-forward" : "arrow-back"}
              color="white"
              size={30}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1, paddingTop: getHeight(1) }}
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
              ) : token ? (
                <View style={styles.noPostsContainer}>
                  <Text style={{ fontSize: 23, color: COLORS.grey }}>
                    Post Deleted
                  </Text>
                </View>
              ) : (
                !token && <LogoutUserComponent navigation={navigation} />
              )}
            </>
          }
          renderItem={({ item, index }) => (
            <RenderItemSinglePost
              item={item}
              index={index}
              data={data}
              setData={setData}
              fetchUri={fetchUri}
              setLoading={setLoading}
              fromSavedPost={fromSavedPost}
            />
          )}
          keyExtractor={(item, index) => index}
        />
      </View>
    </SafeAreaView>
  );
};

export default SinglePost;
