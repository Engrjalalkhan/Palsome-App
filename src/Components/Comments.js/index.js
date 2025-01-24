import React from "react";
import { FlatList, View } from "react-native";
import { Modal } from "react-native";

const index = () => {
  return (
    <Modal animationType="slide" transparent={true} visible={isModalVisible}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 22,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View style={styles.modalView}>
          {item.comments ? (
            <FlatList
              data={item.comments}
              renderItem={(item) => (
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text>{item.item.comment_text}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <Text>No comments ... </Text>
          )}
          <Text>hiiiiiiiiiiiii</Text>
        </View>
      </View>
    </Modal>
  );
};

export default index;
