import React from "react";
import {
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { IMAGES } from "../../Constants/Images";
import { COLORS } from "../../Constants/Colors";

const GotoCallingsApp = () => {
  const navigation = useNavigation();
  const appStoreLink = "https://apps.apple.com/pk/app/callings/id6479602578";
  const playStoreLink =
    "https://play.google.com/store/apps/details?id=com.callings";

  const appStoreURL = Platform.OS === "ios" ? appStoreLink : playStoreLink;

  const handleBackPress = () => {
    navigation.goBack();
  };
  const handlePressInstall = () => {
    Linking.openURL(appStoreURL);
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.header}>
        <TouchableOpacity style={{ padding: 10 }} onPress={handleBackPress}>
          <Icon name="arrow-back" size={28} color={"#000"} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <FastImage source={IMAGES.touchBase} style={styles.logo} />

        <Text style={[styles.title]}>Install Callings</Text>
        <Text style={[styles.description]}>
          Connect with friends and the world around you on Palsome.
        </Text>
      </View>
      <View style={styles.footer}>
        <Text
          style={[
            styles.description,
            {
              marginBottom: 20,
            },
          ]}
        >
          Please install 'Callings' app. Some actions, such as sending messages
          or call features require the Callings app.
        </Text>
        <TouchableOpacity
          onPress={handlePressInstall}
          style={styles.installButton}
        >
          <Text style={styles.installText}>Install</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GotoCallingsApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 15,
  },

  content: {
    alignItems: "center",
    marginTop: 20,
    flex: 1,
  },
  logo: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 10,
    color: COLORS.black,
    marginTop: 15,
  },
  description: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: COLORS.textSecondary,
    marginHorizontal: 20,
    marginTop: 15,
  },
  footer: {
    justifyContent: "space-between",
    padding: 20,
  },
  installButton: {
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
  },
  installText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
