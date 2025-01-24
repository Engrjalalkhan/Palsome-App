import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";

import { Text } from "react-native-paper";
import { Divider } from "react-native-paper";
import CardList from "../../../Components/CardList";
import { ListItem, Left, Body, List } from "native-base";
import { View, SafeAreaView, Image, Alert } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import styles from "./styles";
import {
  fetchEducationData,
  deleteEducation,
} from "../../../Redux/actions/ProfileActions";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import MyHeader from "../../../Components/MyHeader";
import { IMAGES } from "../../../Constants/Images";

const Education = ({ navigation }) => {
  const token = useSelector((state) => state.auth.userToken);
  const eduData = useSelector((state) => state.prof.educationData);
  const sucess = useSelector((state) => state.newsF.successMessage);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [results, setResults] = useState([]);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isFocused = useIsFocused();

  const SetEducation = async () => {
    // console.log("edu data", eduData?.payload.data.educations);
    setResults(eduData?.payload?.data?.educations);
  };

  const deleteEdu = (Id) => {
    setIsDeleted(false);
    console.log("its called", Id);
    dispatch(deleteEducation({ id: Id, token: token, setIsDeleted }));
  };

  const showConfirmDialog = (Id) => {
    setModalVisible(!modalVisible);
    return Alert.alert(
      t("Are you sure?"),
      t("Are you sure you want to remove this education?"),
      [
        {
          text: t("No"),
        },
        {
          text: t("Yes"),
          onPress: () => {
            deleteEdu(Id);
          },
        },
      ]
    );
  };

  const updateEdu = (res) => {
    navigation.navigate("EditEducation", { data: res });
  };

  useEffect(() => {
    dispatch(fetchEducationData(token));
  }, [isFocused, isDeleted]);

  useEffect(() => {
    SetEducation();
  }, [eduData, isFocused]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.textmain}>
        <MyHeader goBack={navigation.goBack} heading={t("Your Education")} />
        <View style={{ flex: 1, paddingHorizontal: widthPercentageToDP("3") }}>
          <Divider
            style={{ height: 1, marginVertical: heightPercentageToDP("0") }}
          />
          <List>
            <ListItem
              avatar
              noBorder
              style={{
                marginLeft: widthPercentageToDP("1"),
                marginTop: heightPercentageToDP("1"),
              }}
              onPress={() => navigation.navigate("AddEducation")}
            >
              <Left>
                <Image source={IMAGES.vectorPlusIcon} />
              </Left>
              <Body>
                <Text style={{ fontSize: 25 }}>{t("Add Education")}</Text>
              </Body>
            </ListItem>
          </List>
          <Divider style={{ height: 1 }} />
          <View style={styles.sub}>
            <CardList
              results={results}
              mode="education"
              onPressDelete={(id) => showConfirmDialog(id)}
              onPressUpdate={(res) => updateEdu(res)}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
export default Education;
