import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";
import { IMAGES } from "../../../../Constants/Images";
import { COLORS } from "../../../../Constants/Colors";
import { HP, WP } from "../../../../../Utils/Resposive";
import { SITE_URL } from "../../../../Services/Constants";

const InviteStatusModal = (props) => {
  const { t } = useTranslation();

  const { hideVisible, guestsList, openProfile } = props;

  const categories = [
    { label: "Going", value: "0" },
    { label: "Maybe", value: "1" },
    { label: "Not Interested", value: "2" },
    { label: "Invited", value: "-1" },
  ];

  const [focused, setFocused] = useState("0");
  const [focusedTabIndex, setFocusedTabIndex] = useState(0);

  const onCancelPress = () => {
    hideVisible(false);
  };

  const labelStyle = (index) => {
    return {
      fontWeight: "bold",
      color: index === focusedTabIndex ? "white" : "black",
    };
  };

  const tabBulletStyle = (index) => {
    return {
      backgroundColor:
        index === focusedTabIndex ? COLORS.primary : COLORS.white,
    };
  };

  const handleTabPress = (ind, cat) => {
    setFocused(cat);
    setFocusedTabIndex(ind);
  };

  const onNamePress = (id) => {
    onCancelPress();
    openProfile(id);
  };

  return (
    <View style={styles.wrapper}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={onCancelPress}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{t("Invite Status")}</Text>

            <TouchableOpacity onPress={onCancelPress}>
              <Image source={IMAGES.crossIcon} style={styles.crossIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.bodyContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesWrapper}
            >
              {categories.map((cat, ind) => (
                <TouchableOpacity
                  key={ind}
                  style={[styles.categoryCard, tabBulletStyle(ind)]}
                  onPress={() => handleTabPress(ind, cat?.value)}
                >
                  <Text style={labelStyle(ind)}>{`${cat?.label} (${
                    guestsList[cat.value]?.length
                  })`}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <FlatList
              data={guestsList[focused]}
              keyExtractor={(_, index) => index}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <View style={styles.imageCard}>
                    <FastImage
                      style={styles.dp}
                      source={
                        item?.profile_picture
                          ? {
                              uri: SITE_URL + item?.profile_picture,
                            }
                          : IMAGES.blankDP
                      }
                    />

                    <Text style={styles.text}>
                      <Text onPress={() => onNamePress(item?.id)}>
                        {`${item?.first_name} ${item?.last_name}`}
                      </Text>

                      <Text style={{ fontWeight: "normal" }}> invited by </Text>

                      <Text onPress={() => onNamePress(item?.invited_by?.id)}>
                        {item?.invited_by?.first_name}{" "}
                        {item?.invited_by?.last_name}
                      </Text>
                    </Text>
                  </View>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyBody}>
                  <Text style={styles.headerText}>
                    {focusedTabIndex == 0
                      ? 'No people have responded "Going"'
                      : focusedTabIndex == 1
                      ? 'No people have responded "Maybe"'
                      : focusedTabIndex == 2
                      ? 'No people have responded "Not Interested"'
                      : "No people have been invited"}
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InviteStatusModal;

const styles = StyleSheet.create({
  wrapper: {
    left: 0,
    right: 0,
    bottom: 0,
    top: HP(8),
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  container: {
    left: 0,
    right: 0,
    top: HP(8),
    bottom: HP(5),
    margin: WP(2),
    borderRadius: 10,
    position: "absolute",
    backgroundColor: COLORS.white,
  },

  headerContainer: {
    height: 60,
    padding: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    shadowColor: COLORS.black,
    backgroundColor: COLORS.white,
    justifyContent: "space-between",

    shadowRadius: 2,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },

  headerText: { fontSize: 18, fontWeight: "bold" },
  crossIcon: { width: 25, height: 25, resizeMode: "contain" },

  bodyContainer: {
    // flex: 0.99,
    marginHorizontal: WP(2),
    paddingHorizontal: WP(2),
  },

  categoriesWrapper: { marginVertical: HP(1.5) },

  emptyBody: {
    height: HP(35),
    alignItems: "center",
    justifyContent: "flex-end",
  },

  categoryCard: {
    elevation: 1,
    height: HP(4),
    borderWidth: 1,
    marginRight: 5,
    borderRadius: 5,
    borderColor: "#ddd",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
    shadowColor: COLORS.black,
    backgroundColor: COLORS.white,

    shadowRadius: 1,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
  },

  imageCard: {
    marginVertical: 5,
    alignItems: "center",
    flexDirection: "row",
  },

  dp: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  text: {
    fontSize: 16,
    width: WP(72),
    marginLeft: WP(2),
    fontWeight: "bold",
  },
});
