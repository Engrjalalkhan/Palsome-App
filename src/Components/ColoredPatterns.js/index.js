import React, { useEffect } from "react";
import { View, Image, FlatList, TouchableOpacity } from "react-native";

import { useSelector } from "react-redux";
import { WP } from "../../../Utils/Resposive";
import { SITE_URL } from "../../Services/Constants";

const ColoredPatterns = (props) => {
  const myPatterns = useSelector((state) => state.newsF.coloredPatterns);

  useEffect(() => {
    if (
      !props?.pattern?.background_image &&
      !props?.pattern?.background_color_1 &&
      !props?.pattern?.background_color_1
    ) {
      props.handleColorPat(myPatterns[0]);
    }
  }, []);

  const renderItem = (item) => {
    return (
      <View style={{ justifyContent: "center" }}>
        {item.type === "image" ? (
          <TouchableOpacity
            onPress={() => {
              props.handleColorPat(item);
            }}
          >
            <Image
              style={{ width: WP(10), height: WP(10), borderRadius: WP(10) }}
              source={{
                uri: SITE_URL + "frontend/img/" + item.background_image,
              }}
            />
          </TouchableOpacity>
        ) : (
          <View>
            <TouchableOpacity
              onPress={() => {
                props.handleColorPat(item);
              }}
              style={{
                width: WP(10),
                height: WP(10),
                borderRadius: WP(10),
                backgroundColor: item.background_color_1,
              }}
            />
          </View>
        )}
      </View>
    );
  };

  const itemSeparator = () => {
    return (
      <View
        style={{
          width: WP(2),
        }}
      />
    );
  };

  return myPatterns ? (
    <View style={{ flex: 1 }}>
      <FlatList
        horizontal={true}
        style={{ flex: 1 }}
        data={myPatterns}
        renderItem={({ item }) => renderItem(item)}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={itemSeparator}
      />
    </View>
  ) : null;
};

export default ColoredPatterns;
