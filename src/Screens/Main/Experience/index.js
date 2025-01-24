import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Text,
} from "react-native";

import MyHeader from "../../../Components/MyHeader";
import CardList from "../../../Components/CardList";
import { Divider } from "react-native-paper";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { ListItem, Left, Body, List } from "native-base";

import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExperience,
  deleteExperience,
} from "../../../Redux/actions/ProfileActions";
import { useIsFocused } from "@react-navigation/native";
import { IMAGES } from "../../../Constants/Images";

const Experience = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isFocused = useIsFocused();

  const token = useSelector((state) => state.auth.userToken);

  const expData = useSelector((state) => state.prof.expData);
  const [results, setResults] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const SetExperience = async () => {
    console.log("expData", expData?.payload?.data?.employments);
    setResults(expData?.payload?.data?.employments);
  };
  useEffect(() => {
    dispatch(fetchExperience(token));
  }, [isFocused, isDeleted]);

  useEffect(() => {
    SetExperience();
  }, [expData, isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    console.log("refreshed");
    dispatch(fetchExperience(token));

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  const deleteExp = (Id) => {
    setIsDeleted(false);
    console.log("its called", Id);
    dispatch(deleteExperience({ id: Id, token: token, setIsDeleted }));
  };

  const showConfirmDialog = (Id) => {
    setModalVisible(!modalVisible);
    return Alert.alert(
      t("Are you sure?"),
      t("Are you sure you want to remove this experience?"),
      [
        {
          text: t("Yes"),
          onPress: () => {
            deleteExp(Id);
          },
        },

        {
          text: t("No"),
        },
      ]
    );
  };

  const updateExp = (res) => {
    navigation.navigate("EditExperience", { data: res });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1, width: "100%" }}>
        <MyHeader goBack={navigation.goBack} heading={t("Your Experience")} />
        <View style={styles.textmain}>
          <Divider
            style={{ height: 1, marginVertical: heightPercentageToDP("1") }}
          />

          <List>
            <ListItem
              avatar
              noBorder
              style={{
                marginLeft: widthPercentageToDP("1"),
                marginTop: heightPercentageToDP("1"),
              }}
              onPress={() => navigation.navigate("AddExperience")}
            >
              <Left>
                <Image source={IMAGES.vectorPlusIcon} />
              </Left>
              <Body>
                <Text style={{ fontSize: 25 }}>{t("Add Experience")}</Text>
              </Body>
            </ListItem>
          </List>

          <Divider
            style={{ height: 1, marginVertical: heightPercentageToDP("0.5") }}
          />

          <View style={styles.sub}>
            <CardList
              results={results}
              mode="employment"
              refreshing={refreshing}
              onRefresh={() => onRefresh()}
              onPressDelete={(id) => showConfirmDialog(id)}
              onPressUpdate={(res) => updateExp(res)}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default Experience;
