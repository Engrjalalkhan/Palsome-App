import { View } from "react-native";
import React from "react";
import { Image } from "react-native";
import { FlatList } from "react-native";
import { HP, WP } from "../../../Utils/Resposive";

const MultipleImages = (props) => {
  return (
    <View>
      <FlatList
        keyExtractor={(item, index) => index}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={props.images}
        renderItem={({ item, index }) => (
          <Image
            key={index}
            s
            resizeMode="cover"
            style={{
              width: WP(33),
              height: HP(14),
              marginTop: HP(1),
              marginHorizontal: WP(0.1),
            }}
            source={{ uri: item.uri ? item.uri : "" }}
          />
        )}
      />
    </View>
  );
};
export default React.memo(MultipleImages);
