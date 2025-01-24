import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppStyle from "../../../../styles/AppStyle";
import { size } from "../../../../styles/fonts";
import { ActivityIndicator } from "react-native-paper";
import { COLORS } from "../../../../Constants/Colors";

const SwitchLanguageAnimated = ({ route, navigation }) => {
  const { t } = useTranslation();

  const language = route.params?.item;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "MyTopTabs" }],
      });
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={AppStyle.p15}>
          <Text style={(size.medium, styles.languageLabel)}>
            {t("Just a moment while we set up")} {language?.label}...
          </Text>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SwitchLanguageAnimated;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  languageLabel: {
    marginBottom: 30,
  },
});
