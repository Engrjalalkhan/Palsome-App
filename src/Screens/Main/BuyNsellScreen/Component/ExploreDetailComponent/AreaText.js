import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { getFontSize, getWidth } from "../../../../../../Utils/NewResponsive";

const AreaText = ({ title, detail, feature, Wrap }) => {
  const { t } = useTranslation();

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <Text
          style={{
            fontSize: getFontSize(2),
            paddingTop: 10,
            fontWeight: "bold",
          }}
        >
          {t(title)}
        </Text>
        <Text>{t(detail)}</Text>
      </View>
      {Wrap && (
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {feature?.map((item, index) => {
            return (
              <View
                key={item.id || index}
                style={{
                  flexDirection: "row",
                  paddingTop: 10,
                  flexWrap: "wrap",
                  width: getWidth(30),
                  paddingRight: 10,
                }}
              >
                <Text>{t(item?.feature_name)}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default AreaText;

const styles = StyleSheet.create({});
