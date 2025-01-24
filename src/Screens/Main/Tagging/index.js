import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";

import { Switch } from "react-native-paper";
import { Body, Button, Left, ListItem, Right } from "native-base";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { WP } from "../../../../Utils/Resposive";
import MyHeader from "../../../Components/MyHeader";
import {
  settingsApiCall,
  withoutStringiApiCall2,
} from "../../../Services/Apis";
import Toast from "react-native-simple-toast";
import { COLORS } from "../../../Constants/Colors";
import { alignment } from "../../../styles/TextAlignment";
import { useBackHandler } from "../../../../Utils/backHardwareBackPress/handleHardBackPress";

const Tagging = ({ navigation }) => {
  const { t } = useTranslation();
  const [tageme, setTagme] = useState(false);
  const token = useSelector((state) => state.auth.userToken);

  useBackHandler(() => {
    navigation.goBack(); // Custom behavior
    return true; // Prevent default action
  });

  const fetchPrivacy = async () => {
    try {
      const res = await settingsApiCall({
        route: "privacy_profile",
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        console.log("res !== 200 ... ", res);

        Toast.show("Error getting privacy", Toast.SHORT);
      } else if (res.responseCode == 200) {
        console.log("response", res?.payload?.data?.can_tag_in_post);
        res?.payload?.data?.can_tag_in_post ? setTagme(true) : setTagme(false);
      }
    } catch (e) {
      console.log("saga deletePost error -- ", e.toString());
    }
  };
  const updatePrivacy = async (val) => {
    const formData = new FormData();
    formData.append(Object.keys(val)[0], Object.values(val)[0]);

    console.log(formData);

    try {
      const res = await withoutStringiApiCall2({
        route: "update_privacy_profile",
        verb: "POST",
        token: token,
        params: formData,
      });
      if (res.responseCode !== 200) {
        console.log("res !== 200 ... ", res);
        Toast.show("Error getting privacy", Toast.SHORT);
      } else if (res.responseCode == 200) {
        console.log("response", res);
        Toast.show(res?.message, Toast.SHORT);
      }
    } catch (e) {
      console.log("saga deletePost error -- ", e.toString());
    }
  };
  useEffect(() => {
    fetchPrivacy();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <MyHeader
        goBack={() => navigation.goBack()}
        heading={t("User Post Tagging")}
      />

      <ListItem icon noBorder style={styles.listitem}>
        <Body>
          <Text style={[styles.txt, alignment.left]}>
            {t("Allow friends to tag me in post")}
          </Text>
        </Body>
        <Right>
          <Switch
            trackColor={{ false: COLORS.tooLightGrey, true: COLORS.primary }}
            thumbColor={tageme ? COLORS.tooLightGrey : COLORS.tooLightGrey}
            ios_backgroundColor={COLORS.tooLightGrey}
            onValueChange={(val) => {
              setTagme(val);
              updatePrivacy({ can_tag_in_post: val == true ? 1 : 0 });
            }}
            value={tageme}
          />
        </Right>
      </ListItem>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: COLORS.tooLightGrey,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  back: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
  },
  txt: { fontWeight: "bold", fontSize: WP(3.8) },
});

export default Tagging;
