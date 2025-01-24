import React from "react";
import { useTranslation } from "react-i18next";
import { View, Text, StyleSheet, Image } from "react-native";
import { HP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";
import { IMAGES } from "../../Constants/Images";

const index = (props) => {
  const { t } = useTranslation();

  return (
    <View
      style={{
        marginTop: HP(20),
        alignSelf: "center",
        alignItems: "center",
      }}
    >
      <Image
        style={{ height: HP(12), width: HP(9) }}
        source={IMAGES.searchNotFound}
      />
      {props?.noInputText ? (
        <Text
          style={{
            fontWeight: "bold",
            marginTop: 10,
            color: COLORS.secondary,
          }}
        >
          {t("Type something to search")}
        </Text>
      ) : (
        <>
          <Text
            style={{
              fontWeight: "bold",
              marginTop: 10,
              color: COLORS.secondary,
            }}
          >
            {t("No Record Found")}
          </Text>
          <Text
            style={{
              marginTop: 1,
              color: COLORS.secondary,
            }}
          >
            {t("What you searched was unfortunately not found.")}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
});
export default index;
