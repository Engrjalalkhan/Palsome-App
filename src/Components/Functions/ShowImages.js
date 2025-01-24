import { View } from "react-native";
import React from "react";
import { ScrollView } from "react-native";
import FastImage from "react-native-fast-image";
import { HP } from "../../../Utils/Resposive";
import { WidthScreen } from "../TopBar/Dimensions";
import { COLORS } from "../../Constants/Colors";

export const ShowImages = (props) => {

  if (props.imgUris) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={200}
          decelerationRate="fast"
          pagingEnabled
        >
          {props.imgUris.map((itm, ind) => {
            return (
              <FastImage
                key={ind}
                resizeMode="cover"
                style={{
                  width: WidthScreen * 0.4,
                  height: HP(17.5),
                  marginTop: HP(1),
                  borderLeftColor: COLORS.white,
                  borderLeftWidth: 2,
                }}
                source={{
                  uri: itm.uri,
                }}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
};
