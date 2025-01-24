import { useTranslation } from "react-i18next";
import * as React from "react";
import {
  View,
  StatusBar,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";

import HomeHeader from "../../../Components/HomeHeader";
import StoryView from "../../../Components/StoryView";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import TopBar from "../../../Components/TopBar";

import NewsfComponent from "../../../Components/NewsFeedList";
import NewPost from "../../../Components/NewPost";
import { useState } from "react";

import { FlatListItemSeparator } from "../../../Components/NewsFeedList/Functions";
import { IMAGES } from "../../../Constants/Images";
import { COLORS } from "../../../Constants/Colors";

export let isModalVisible = false;
export const result = [
  {
    id: "1",
    Members: "2 Members",
  },
  {
    id: "2",
    Members: "3 Memebers",
  },
  {
    id: "3",
    Members: "2 Members",
  },
  {
    id: "4",
    Members: "3 Memebers",
  },
  {
    id: "5",
    Members: "2 Members",
  },
  {
    id: "6",
    Members: "3 Memebers",
  },
  {
    id: "7",
    Members: "2 Members",
  },
  {
    id: "8",
    Members: "3 Memebers",
  },
];

const Hashtag = ({ navigation, route }) => {
  console.log("🚀  file: index.js:61  Hashtag ~ userId:", route.params?.userId);
  const ReelNavigation = route.params?.stop;
  const { height } = Dimensions.get("window");

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const editPostLoading = useSelector(
    (state) => state.blackNewsF.editPostLoading
  );
  const token = useSelector((state) => state.auth.userToken);
  const [postText, setPostText] = useState("");
  const [topBarVisible, setTopBarVisible] = useState(true);
  const StoriesData = {
    stories: [
      {
        name: "Friends",
        image: IMAGES.oval,
      },
      {
        name: "Sports",
        image: IMAGES.illustration,
      },
      {
        name: "Art",
        image: IMAGES.oval,
      },
      {
        name: "Coding",
        image: IMAGES.dice,
      },
      {
        name: "Cars",
        image: IMAGES.oval,
      },
    ],
  };

  const handleText = (val) => {
    setPostText(val);
  };

  const setSearchEnable = () => {
    console.log("its called");
    navigation.navigate("SearchComponent");
  };

  const ListHeaderComponent = () => {
    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 15,
          }}
        >
          <Text style={styles.txt2}>{route.params.userId} </Text>
          <Text
            style={{
              color: "black",
              fontSize: 15,
              fontWeight: "200",
            }}
          >
            {t("People are posting about this")}
          </Text>
        </View>
        <FlatListItemSeparator />
      </>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} />
      {topBarVisible && (
        <View>
          <TopBar title="Palsome" />
          <View style={styles.head}>
            <HomeHeader
              setSearchEnable={() => setSearchEnable()}
              backArrow={true}
            />
          </View>
        </View>
      )}
      <View>
        {/* <Divider style={styles.dividerStyle} />
        <View style={styles.storycontainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <StoryView
              mode="me"
              name={"New"}
              image={IMAGES.shape}
            />
            {StoriesData.stories.map((stories, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => console.log(token)}
                >
                  <StoryView
                    mode="active"
                    name={stories.name}
                    image={stories.image}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <Divider style={{ height: 1, marginTop: heightPercentageToDP("-2") }} /> */}
      </View>
      <View style={{ flex: 1, height: height }}>
        {editPostLoading ? (
          <View style={styles.loading}>
            <Text style={styles.txt}>{t("Updating your post ...")} </Text>
            <ActivityIndicator color={COLORS.white} />
          </View>
        ) : null}
        <NewsfComponent
          Header={ListHeaderComponent}
          topBarVisible
          setTopBarVisible={setTopBarVisible}
          hashtag={route.params.userId.substring(1)}
          ReelNavigation={ReelNavigation}
        />
      </View>
    </View>
  );
};

export default Hashtag;
