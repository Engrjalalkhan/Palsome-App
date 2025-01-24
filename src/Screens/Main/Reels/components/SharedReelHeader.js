import React from "react";
import Feather from "react-native-vector-icons/Feather";
import { View, StyleSheet, TouchableOpacity } from "react-native";

import { COLORS } from "../../../../Constants/Colors";

const SharedReelHeader = ({ muteVoume, mute, group }) => {
  return (
    <View style={[styles.controlsCon, { marginTop: group ? 10 : -35 }]}>
      <TouchableOpacity>
        {!mute ? (
          <Feather
            name="volume-2"
            size={24}
            color={COLORS.white}
            onPress={muteVoume}
          />
        ) : (
          <Feather
            name="volume-x"
            size={24}
            color={COLORS.white}
            onPress={muteVoume}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsCon: {
    flexDirection: "row",
    resizeMode: "contain",
    marginTop: -35,
    marginRight: 20,
    alignSelf: "flex-end",
    // top: 5,
  },
});

export default React.memo(SharedReelHeader);
