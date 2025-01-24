import React from "react";
import { useTranslation } from "react-i18next";

import { SafeAreaView, View, Image } from "react-native";
import MyHeader from "../../../Components/MyHeader";

import { Divider } from "react-native-paper";
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import {
  Content,
  Button,
  ListItem,
  Text,
  Icon,
  Left,
  Body,
  Right,
} from "native-base";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import styles from "./styles";
import { WP } from "../../../../Utils/Resposive";
import { IMAGES } from "../../../Constants/Images";
import { alignment } from "../../../styles/TextAlignment";
import { isRTL } from "../../../../Utils/IsRTL";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const SecurityAndLogin = (props) => {
  const { t } = useTranslation();
  useBackHandler(() => {
    props?.navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  return (
    <SafeAreaView style={styles.main}>
      <MyHeader
        goBack={props.navigation.goBack}
        heading={t("Security & Login")}
      />

      {/* <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      > */}
      <Divider
        style={{ height: 1, marginVertical: heightPercentageToDP("1") }}
      />
      <Content style={{ marginVertical: heightPercentageToDP("1") }}>
        <ListItem
          icon
          noBorder
          style={styles.listitem}
          onPress={() => props.navigation.navigate("ForgetPassword")}
        >
          <Left>
            <View style={styles.imgWrapper}>
              <Image source={IMAGES.changePassword} style={styles.image} />
            </View>
          </Left>
          <Body>
            <Text style={alignment.left}>{t("Change Password")}</Text>
          </Body>
          <Right>
            <Icon
              active
              name={isRTL ? "chevron-back-outline" : "chevron-forward-outline"}
            />
          </Right>
        </ListItem>
        <ListItem
          icon
          noBorder
          style={styles.listitem}
          onPress={() => props.navigation.navigate("LoggedInDevices")}
        >
          <Left>
            <View style={styles.imgWrapper}>
              <Image source={IMAGES.loggedInDevices} style={styles.image} />
            </View>
          </Left>
          <Body>
            <Text style={alignment.left}>{t("Logged in Devices")}</Text>
          </Body>
          <Right>
            <Icon
              active
              name={isRTL ? "chevron-back-outline" : "chevron-forward-outline"}
            />
          </Right>
        </ListItem>
      </Content>
      {/* </KeyboardAwareScrollView> */}
    </SafeAreaView>
  );
};
export default SecurityAndLogin;
