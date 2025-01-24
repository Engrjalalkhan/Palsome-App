import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { getHeight } from "../../../Utils/NewResponsive";
import { COLORS } from "../../Constants/Colors";
import { TouchableOpacity } from "react-native";

const LogoutUserComponent = ({ style, navigation }) => {
  return (
    <View style={[styles.noPostsContainer, style]}>
      <Text style={{ fontSize: 23, color: COLORS.grey }}>
        Please Sign In to continue
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.replace("Intro");
        }}
      >
        <Text
          style={{
            color: COLORS.primary,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Go to Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogoutUserComponent;

const styles = StyleSheet.create({
  noPostsContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
    marginTop: 20,
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
