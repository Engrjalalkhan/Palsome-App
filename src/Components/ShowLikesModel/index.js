import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  View,
  Modal,
  Text,
  Image,
  useWindowDimensions,
} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import { HP, WP } from "../../../Utils/Resposive";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import AllFlatlist from "./AllFlatlist";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";

// import Modal from "react-native-modal";

const ShowLikeModel = (props) => {
  const {
    item_type,
    post_id,
    isLikeModell,
    setIsLikeModell,
    data = {},
    post_reactions_count,
    pressfunction,
  } = props;
  const { t } = useTranslation();

  const All = () => {
    const allData = data?.all || [];
    const combinedData = [
      ...(data?.like || []),
      ...(data?.haha || []),
      ...(data?.heart || []),
      ...(data?.angry || []),
      ...(data?.wow || []),
      ...(data?.sad || []),
    ];

    return (
      <AllFlatlist
        data={allData.length ? allData : combinedData}
        isLikeModell={isLikeModell}
        setIsLikeModell={setIsLikeModell}
        pressfunction={pressfunction}
      />
    );
  };
  const NoReact = ({ react }) => {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20%",
        }}
      >
        <Image
          style={{
            width: 100,
            height: 100,
          }}
          source={IMAGES.people}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold", color: COLORS.grey }}>
          {t("No people reacted")} {react}
        </Text>
      </View>
    );
  };

  const Haha = () => {
    return data?.hahas?.length ? (
      <AllFlatlist
        data={data?.hahas}
        isLikeModell={isLikeModell}
        setIsLikeModell={setIsLikeModell}
        pressfunction={pressfunction}
      />
    ) : data?.haha?.length ? (
      <AllFlatlist
        data={data?.haha}
        isLikeModell={isLikeModell}
        setIsLikeModell={setIsLikeModell}
        pressfunction={pressfunction}
      />
    ) : (
      <NoReact react={t("smile")} />
    );
  };
  const Love = () => {
    return data?.hearts?.length ? (
      <AllFlatlist
        data={data?.hearts}
        isLikeModell={isLikeModell}
        setIsLikeModell={setIsLikeModell}
        pressfunction={pressfunction}
      />
    ) : data?.heart?.length ? (
      <AllFlatlist
        data={data?.heart}
        isLikeModell={isLikeModell}
        setIsLikeModell={setIsLikeModell}
        pressfunction={pressfunction}
      />
    ) : (
      <NoReact react={t("heart")} />
    );
  };
  const Angry = () => {
    return data?.angry_s?.length ? (
      <AllFlatlist
        data={data?.angry_s}
        isLikeModell={isLikeModell}
        setIsLikeModell={setIsLikeModell}
        pressfunction={pressfunction}
      />
    ) : data?.angry?.length ? (
      <AllFlatlist
        data={data?.angry}
        isLikeModell={isLikeModell}
        setIsLikeModell={setIsLikeModell}
        pressfunction={pressfunction}
      />
    ) : (
      <NoReact react={t("angry")} />
    );
  };
  const Like = () => {
    return data?.likes?.length ? (
      <AllFlatlist
        data={data?.likes}
        isLikeModell={isLikeModell}
        setIsLikeModell={setIsLikeModell}
        pressfunction={pressfunction}
      />
    ) : data?.like?.length ? (
      <AllFlatlist
        data={data?.like}
        isLikeModell={isLikeModell}
        setIsLikeModell={setIsLikeModell}
        pressfunction={pressfunction}
      />
    ) : (
      <NoReact react={t("thumbs up")} />
    );
  };
  const Wow = () => {
    return data?.wows?.length ? (
      <AllFlatlist
        data={data?.wows}
        isLikeModell={isLikeModell}
        setIsLikeModell={setIsLikeModell}
        pressfunction={pressfunction}
      />
    ) : data?.wow?.length ? (
      <AllFlatlist
        data={data?.wow}
        isLikeModell={isLikeModell}
        setIsLikeModell={setIsLikeModell}
        pressfunction={pressfunction}
      />
    ) : (
      <NoReact react={t("wow")} />
    );
  };

  const Sad = () => {
    return data?.sads?.length ? (
      <AllFlatlist
        data={data?.sads}
        isLikeModell={isLikeModell}
        setIsLikeModell={setIsLikeModell}
        pressfunction={pressfunction}
      />
    ) : data?.sad?.length ? (
      <AllFlatlist
        data={data?.sad}
        isLikeModell={isLikeModell}
        setIsLikeModell={setIsLikeModell}
        pressfunction={pressfunction}
      />
    ) : (
      <NoReact react={t("sad")} />
    );
  };

  const renderScene = SceneMap({
    all: All,
    haha: Haha,
    love: Love,
    angry: Angry,
    like: Like,
    wow: Wow,
    sad: Sad,
  });

  const getTabBarIcon = (props) => {
    const { route } = props;
    return route.key === "haha" ? (
      <View style={styles.tabHeaderBox}>
        <Image source={IMAGES.haha_static} style={styles.img} />
        {data?.hahas?.length ? (
          <Text style={styles.txt}> {data?.hahas?.length}</Text>
        ) : data?.haha?.length ? (
          <Text style={styles.txt}> {data?.haha?.length}</Text>
        ) : null}
      </View>
    ) : route.key === "love" ? (
      <View style={styles.tabHeaderBox}>
        <Image source={IMAGES.love_static} style={styles.img} />
        {data?.hearts?.length ? (
          <Text style={styles.txt}> {data?.hearts?.length}</Text>
        ) : data?.heart?.length ? (
          <Text style={styles.txt}> {data?.heart?.length}</Text>
        ) : null}
      </View>
    ) : route.key === "angry" ? (
      <View style={styles.tabHeaderBox}>
        <Image source={IMAGES.angry_static} style={styles.img} />
        {data?.angry_s?.length ? (
          <Text style={styles.txt}> {data?.angry_s?.length}</Text>
        ) : data?.angry?.length ? (
          <Text style={styles.txt}> {data?.angry?.length}</Text>
        ) : null}
      </View>
    ) : route.key === "like" ? (
      <View style={styles.tabHeaderBox}>
        <Image source={IMAGES.like_static_fill} style={styles.img} />
        {data?.likes?.length ? (
          <Text style={styles.txt}> {data?.likes?.length}</Text>
        ) : data?.like?.length ? (
          <Text style={styles.txt}> {data?.like?.length}</Text>
        ) : null}
      </View>
    ) : route.key === "sad" ? (
      <View style={styles.tabHeaderBox}>
        <Image source={IMAGES.sad} style={styles.img} />
        {data?.sads?.length ? (
          <Text style={styles.txt}> {data?.sads?.length}</Text>
        ) : data?.sad?.length ? (
          <Text style={styles.txt}> {data?.sad?.length}</Text>
        ) : null}
      </View>
    ) : route.key === "wow" ? (
      <View style={styles.tabHeaderBox}>
        <Image source={IMAGES.wow_static} style={styles.img} />
        {data?.wows?.length ? (
          <Text style={styles.txt}> {data?.wows?.length}</Text>
        ) : data?.wow?.length ? (
          <Text style={styles.txt}> {data?.wow?.length}</Text>
        ) : null}
      </View>
    ) : post_reactions_count ? (
      <Text style={styles.txt}>
        {t("All")} {post_reactions_count}
      </Text>
    ) : (
      <Text style={styles.txt}>
        {t("All")} {data?.all?.length}
      </Text>
    );
  };

  const config = {
    velocityThreshold: 0.1,
    directionalOffsetThreshold: 1,
    gestureIsClickThreshold: 1,
  };
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "all", title: "All" },
    { key: "like", title: "Like" },
    { key: "love", title: "Love" },
    { key: "haha", title: "Haha" },
    { key: "wow", title: "Wow" },
    { key: "sad", title: "Sad" },
    { key: "angry", title: "Angry" },
  ]);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isLikeModell}
        style={{ flex: 1 }}
        onRequestClose={() => setIsLikeModell(false)}
        propagateSwipe
      >
        <GestureRecognizer
          onTouchStart={() => setIsLikeModell(false)}
          config={config}
          style={{
            flex: 1,
            backgroundColor: "transparent",
          }}
        />
        <View style={styles.Contanier}>
          <View style={styles.ModelContanier}>
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: layout.width }}
              renderTabBar={(props) => (
                <TabBar
                  scrollEnabled
                  style={{ backgroundColor: COLORS.white }}
                  {...props}
                  indicatorStyle={styles.tabStyle}
                  renderIcon={(props) => getTabBarIcon(props)}
                  tabStyle={styles.bubble}
                  labelStyle={styles.noLabel}
                />
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  Contanier: {
    flex: 1,
  },
  ModelContanier: {
    backgroundColor: COLORS.white,
    height: HP(45),
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  img: {
    height: HP(3),
    width: WP(6),
    resizeMode: "stretch",
  },
  reaction: {
    paddingHorizontal: WP(5),
    flexDirection: "row",
  },
  scene: {
    flex: 1,
  },
  txt: {
    alignSelf: "center",
    color: COLORS.primary,
  },
  noLabel: {
    display: "none",
    height: 0,
  },
  bubble: { width: WP(22) },
  img: {
    height: 20,
    width: 20,
  },
  tabStyle: {
    backgroundColor: COLORS.primary,
  },
  tabHeaderBox: { flexDirection: "row" },
});

export default React.memo(ShowLikeModel);
