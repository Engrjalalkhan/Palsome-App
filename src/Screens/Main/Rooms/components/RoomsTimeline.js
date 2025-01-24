import React from "react";
import { View, StyleSheet, Text, FlatList, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { HP, WP } from "../../../../../Utils/Resposive";
import { COLORS } from "../../../../Constants/Colors";
import { IMAGES } from "../../../../Constants/Images";

const dummyData = [
  {
    id: 1,
    title: "Post 1",
    description: "This is the first post",
    Image: IMAGES.houseOfCards,
  },
  {
    id: 2,
    title: "Post 2",
    description: "This is the second post",
    Image: IMAGES.houseOfCards,
  },
];

const TopView = (props) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image
        source={IMAGES.houseOfCards}
        style={styles.profileImage}
      />
      <View style={{ marginLeft: 10 }}>
        <Text>Name</Text>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ marginRight: 5 }}>19h</Text>
          <Ionicons name="lock-closed" size={HP(1.7)} color={COLORS.black} />
        </View>
      </View>
    </View>
  );
};

const renderItem = ({ item }) => {
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        marginVertical: 5,
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
    >
      <TopView />
      <View style={styles.itemContainer}>
        <Image
          source={IMAGES.houseOfCards}
          style={{ width: WP("100"), height: HP("15") }}
        />
      </View>
    </View>
  );
};

const RoomsTimeLine = (props) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={dummyData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  profileImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 25,
  },
});
export default RoomsTimeLine;
