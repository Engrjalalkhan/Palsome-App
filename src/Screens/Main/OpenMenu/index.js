import React from "react";
import { View } from "react-native";

import Button from "../../../Components/Button";

const CreateRoom = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View style={{ width: "80%" }}>
        <Button
          mode="contained"
          style="large"
          labelStyle="small"
          onPress={() => navigation.navigate("CreateRooms")}
        >
          open room
        </Button>
        <Button
          mode="contained"
          style="large"
          labelStyle="small"
          onPress={() => navigation.navigate("CreateGroups")}
        >
          open Groups
        </Button>
        <Button
          mode="contained"
          style="large"
          labelStyle="small"
          onPress={() => navigation.navigate("CreateEvent")}
        >
          open Events
        </Button>
      </View>
    </View>
  );
};
export default CreateRoom;
