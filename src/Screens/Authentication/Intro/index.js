import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
} from "react-native";
import Button from "../../../Components/Button";
import { IMAGES } from "../../../Constants/Images";
import styles from "./styles";

const Intro = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.container, styles.cont]}>
      <Image source={IMAGES.palsomeLogo} style={styles.img} />
      <Image source={IMAGES.illustration} style={styles.imagecont} />
      <View style={styles.textmain}>
        <Text style={styles.main}>{t("Hello!")}</Text>
        <Text style={styles.sub}>{t("Welcome to Palsome")}</Text>
        <View style={styles.textmain2}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Signin")}
          >
            {t("SIGN IN")}
          </Button>
          <Button mode="outlined" onPress={() => navigation.navigate("Signup")}>
            {t("JOIN NOW")}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Intro;
