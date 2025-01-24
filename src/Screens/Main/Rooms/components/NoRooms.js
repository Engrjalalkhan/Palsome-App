import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text } from "react-native";
import FAicons from "react-native-vector-icons/FontAwesome5";
import { COLORS } from "../../../../Constants/Colors";

const NoRooms = ({ myRoom }) => {
  const { t } = useTranslation();

  return !myRoom ? (
    <View style={styles.container}>
      <FAicons
        name="hotel"
        size={70}
        color={COLORS.black}
        style={styles.icon}
      />
      <Text style={styles.heading}>{t("You have not joined any room")}</Text>
      <Text style={styles.subHeading}>
        {t("Joined rooms will appear here.")}
      </Text>
    </View>
  ) : (
    <View style={styles.container}>
      <FAicons
        name="hotel"
        size={70}
        color={COLORS.black}
        style={styles.icon}
      />
      <Text style={styles.heading}>{t("You have not created any room")}</Text>
      <Text style={styles.subHeading}>
        {t("Created rooms will appear here.")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.9,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 200,
  },
  heading: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.black,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.grey,
    marginTop: 10,
  },
  // icon: { opacity: 0.7 },
});

export default NoRooms;
