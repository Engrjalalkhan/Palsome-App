import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";

import Modal from "react-native-modal";
import { HP, WP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";
import { IMAGES } from "../../Constants/Images";
import { SITE_URL } from "../../Services/Constants";

const TaggedPeopleModal = ({
  isVisible,
  close,
  taggedPeopleList,
  onPressTaggedPerson,
}) => {
  const navigation = useNavigation();
  const onPressItem = (item) => {
    console.log(item);
    close();
    onPressTaggedPerson
      ? onPressTaggedPerson(item.id)
      : navigation.push("ProfileScreen", {
          id: item.id,
        });
  };
  // console.log("taggedPeopleList", taggedPeopleList);
  return (
    <Modal
      isVisible={isVisible}
      style={styles.modal}
      backdropColor="transparent"
      onBackdropPress={close}
      propagateSwipe
    >
      <View style={styles.contantContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTxt}>Tagged</Text>
        </View>
        <View style={styles.listWrapper}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={taggedPeopleList}
            ListEmptyComponent={
              <ActivityIndicator
                animating={true}
                size="large"
                color={COLORS.primary}
              />
            }
            renderItem={({ item, index }) => {
              // console.log("my item - - ", item);
              if (index == 0) return;
              return (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => onPressItem(item)}
                >
                  <Image
                    style={styles.img}
                    source={
                      item?.profile_picture
                        ? {
                            uri: SITE_URL + item?.profile_picture,
                          }
                        : IMAGES.blankDP
                    }
                  />
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
                      {item?.first_name} {item?.last_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { margin: 0, justifyContent: "flex-end" },
  container: {
    flex: 1,
    // backgroundColor: "red",
    justifyContent: "flex-end",
  },
  contantContainer: {
    backgroundColor: "white",
    flex: 0.45,

    //   borderRadius: 30
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    height: HP(5),
    borderBottomWidth: 1,
    borderColor: "lightgray",
  },
  headerTxt: { fontSize: 18, fontWeight: "bold" },
  listWrapper: {
    flex: 1,
    // backgroundColor: "red",
  },

  img: {
    height: WP(12),
    width: WP(12),

    borderRadius: WP(12),
  },
  img2: {
    height: HP(8),
    width: HP(8),
  },
  item: {
    flexDirection: "row",

    marginHorizontal: 20,
    marginVertical: 8,
    alignItems: "center",
  },
});
export default TaggedPeopleModal;
