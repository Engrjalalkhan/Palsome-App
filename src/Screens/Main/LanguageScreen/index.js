import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  I18nManager,
} from "react-native";
import RNRestart from "react-native-restart";
import { useTranslation } from "react-i18next";

import { isRTL } from "../../../../Utils/IsRTL";
import { COLORS } from "../../../Constants/Colors";
import { languages } from "../../../i18n/Languages";
import MyHeader from "../../../Components/MyHeader";
import { useDispatch, useSelector } from "react-redux";
import { saveLanguage } from "../../../Redux/actions/NewsFeedActions";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

export default function LanguageScreen({ navigation }) {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  useBackHandler(() => {
    navigation.goBack(); 
    return true;
  });
  

  const getSelectedLanguage = useSelector((state) => state.newsF.saveLanguage);

  const [selectedLanguage, setSelectedLanguage] = useState(
    getSelectedLanguage || "en"
  );

  const switchLanguage = (language, languageName) => {
    if (language === selectedLanguage) {
      navigation.goBack();
    } else {
      const isNewRTL =
        language === "ar" || language === "fa" || language === "ur";
      const currentRTL = isRTL;

      dispatch(saveLanguage(language));
      setSelectedLanguage(language);
      i18n
        .changeLanguage(language)
        .then(() => {
          if (isNewRTL !== currentRTL) {
            I18nManager.forceRTL(isNewRTL);
            setTimeout(() => {
              RNRestart.Restart();
            }, 500);
          } else {
            navigation.navigate("SwitchLanguageAnimated", {
              item: languageName,
            });
          }
        })
        .catch((error) => {
          console.error("Error changing language:", error);
        });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => switchLanguage(item?.value, item)}
    >
      <Text style={styles.label}>{item?.label}</Text>
      <View style={styles.radioCircle}>
        {selectedLanguage === item?.value && <View style={styles.selectedRb} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <MyHeader goBack={() => navigation.goBack()} heading={t("Language")} />

      <FlatList
        data={languages}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.value}
        windowSize={10}
        initialNumToRender={languages.length}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    padding: 15,
  },
  label: {
    color: COLORS.black,
    fontSize: 18,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.black,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.black,
  },
});
