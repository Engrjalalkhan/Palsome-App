import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  FlatList,
} from "react-native";

import { reactionsData } from "../../../Utils/ReactionsData";
import { COLORS } from "../../Constants/Colors";

const ShowReactions = (props) => {
  const [myStyles, setMyStyles] = useState("");
  const [styleID, setStyleID] = useState();
  // console.log(props.height);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{
          flex: 1,
        }}
        onPressOut={() => props.close()}
      >
        <TouchableWithoutFeedback style={styles.modalView}>
          <FlatList
            horizontal
            data={reactionsData}
            contentContainerStyle={[
              styles.reactionsContainer,
              {
                top:
                  props.height > 400 && props.height < 600
                    ? props.height / 1.25
                    : props.height > 400
                    ? props.height * 0.74
                    : props.height / 1.55,
              },
            ]}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => {
              return (
                <View>
                  <TouchableOpacity
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    key={index}
                    delayLongPress={5}
                    activeOpacity={1}
                    onLongPress={() => {
                      props.close();
                      setStyleID(item.id);
                      props.reactionType(item.id);
                    }}
                    // onPress={() => console.log("1")}
                    onPressOut={() => {
                      setStyleID();
                      props.close();
                    }}
                  >
                    <Image
                      style={
                        item.id === styleID ? styles.bigReacts : styles.reacts
                      }
                      source={item.image}
                    />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reacts: {
    height: 45,
    width: 45,
  },
  bigReacts: {
    height: 95,
    width: 95,
  },
  reactionsContainer: {
    marginTop: 110,
    width: 310,
    height: 53,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 50,
  },
  modalView: {
    flex: 0.9,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    backgroundColor: COLORS.primary,
  },
});

export default React.memo(ShowReactions);
