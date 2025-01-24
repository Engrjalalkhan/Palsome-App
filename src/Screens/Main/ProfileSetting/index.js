import React from "react";
import { useTranslation } from "react-i18next";

import { SafeAreaView, View, Image } from "react-native";

import { Divider } from "react-native-paper";
import MyHeader from "../../../Components/MyHeader";
import { Content, ListItem, Text, Icon, Left, Body, Right } from "native-base";
import { heightPercentageToDP } from "react-native-responsive-screen";
import styles from "./styles";
import { IMAGES } from "../../../Constants/Images";
import { isRTL } from "../../../../Utils/IsRTL";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const ProfileSetting = (props) => {
  const { t } = useTranslation();
  useBackHandler(() => {
    props?.navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  return (
    // <KeyboardAwareScrollView
    //   contentContainerStyle={styles.container}
    //   showsVerticalScrollIndicator={false}
    // >
    <SafeAreaView style={styles.main}>
      <MyHeader goBack={props.navigation.goBack} heading={t("General")} />
      <Divider
        style={{ height: 1, marginVertical: heightPercentageToDP("1") }}
      />
      <Content style={{ marginVertical: heightPercentageToDP("1") }}>
        <ListItem
          icon
          noBorder
          style={styles.listitem}
          onPress={() => props.navigation.navigate("Editprofile")}
        >
          <Left>
            <View style={styles.imgWrapper}>
              <Image source={IMAGES.userIDCard} style={styles.image} />
            </View>
          </Left>
          <Body>
            <Text style={styles.textAlignRtl}>{t("Personal Information")}</Text>
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
          onPress={() => props.navigation.navigate("Education")}
        >
          <Left>
            <View style={styles.imgWrapper}>
              <Image source={IMAGES.graduationHat} style={styles.image} />
            </View>
          </Left>
          <Body>
            <Text style={styles.textAlignRtl}>{t("Education")}</Text>
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
          onPress={() => props.navigation.navigate("Experience")}
        >
          <Left>
            <View style={styles.imgWrapper}>
              <Image source={IMAGES.portfolio} style={styles.image} />
            </View>
          </Left>
          <Body>
            <Text style={styles.textAlignRtl}>{t("Experience")}</Text>
          </Body>
          <Right>
            <Icon
              active
              name={isRTL ? "chevron-back-outline" : "chevron-forward-outline"}
            />
          </Right>
        </ListItem>
      </Content>
    </SafeAreaView>
    // </KeyboardAwareScrollView>
  );
};
export default ProfileSetting;
