import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getHeight, getWidth } from "../../../Utils/NewResponsive";
import { HP, WP } from "../../../Utils/Resposive";
import { SITE_URL } from "../../Services/Constants";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const AllFlatlist = (props) => {
  // console.log("Props======>>>", props?.setModalTrue);
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <FlatList
      keyExtractor={(item, index) => index.toString()}
      data={props?.data}
      // ListEmptyComponent={
      //   <ActivityIndicator animating={true} size="large" color="#DF4B38" />
      // }
      ListEmptyComponent={
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
              color: COLORS.red,
            }}
            source={IMAGES.people}
          />
          <Text
            style={{ fontSize: 20, fontWeight: "bold", color: COLORS.grey }}
          >
            {t("No people reacted")}
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={styles.container}
            onPress={() => {
              props?.setIsLikeModell(false);
              if (props?.pressfunction) {
                props?.pressfunction();
              }
              setTimeout(() => {
                navigation.push("ProfileScreen", { id: item.user?.id });
              }, 100);
            }}
          >
            {item && (
              <View style={styles.innerContainer}>
                <View style={styles.name}>
                  {item?.user?.profile_picture !== null ? (
                    <Image
                      style={styles.img}
                      source={{
                        uri: SITE_URL + item?.user?.profile_picture,
                      }}
                    />
                  ) : (
                    <Image style={styles.img} source={IMAGES.blankDP} />
                  )}

                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: WP(4),
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                      }}
                    >
                      {item?.user?.first_name} {item?.user?.last_name}
                    </Text>
                    {/* <Text>No mutual friend there </Text> */}
                  </View>
                </View>

                {item?.reaction_type_id == 1 && (
                  <Image
                    resizeMode="contain"
                    style={styles.img2}
                    source={IMAGES.like_gif}
                  />
                )}
                {item?.reaction_type_id == 2 && (
                  <Image
                    resizeMode="contain"
                    style={styles.img2}
                    source={IMAGES.love_gif}
                  />
                )}
                {item?.reaction_type_id == 3 && (
                  <Image
                    resizeMode="contain"
                    style={styles.img2}
                    source={IMAGES.haha_gif}
                  />
                )}
                {item?.reaction_type_id == 4 && (
                  <Image
                    resizeMode="contain"
                    style={styles.img2}
                    source={IMAGES.wow_gif}
                  />
                )}
                {item?.reaction_type_id == 5 && (
                  <Image
                    resizeMode="contain"
                    style={styles.img2}
                    source={IMAGES.sad_gif}
                  />
                )}
                {item?.reaction_type_id == 6 && (
                  <Image
                    resizeMode="contain"
                    style={styles.img2}
                    source={IMAGES.angry_gif}
                  />
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "space-between",
  },
  img: {
    height: WP(12),
    width: WP(12),
    resizeMode: "cover",
    borderRadius: 50,
  },
  img2: {
    height: getHeight(8),
    width: getWidth(8),
  },
  innerContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  name: {
    flexDirection: "row",
    // justifyContent: "space-between",
    flex: 1,
  },
});

export default React.memo(AllFlatlist);
