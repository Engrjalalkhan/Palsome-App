import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from "react-native";
import { HP, WP } from "../../../Utils/Resposive";
import { MainArray, showImgFunc } from "../../../Utils/Data";
import { getWidth } from "../../../Utils/NewResponsive";
import { WidthScreen } from "../TopBar/Dimensions";
import { ICONS } from "../../Constants/Icons";
import { COLORS } from "../../Constants/Colors";
import { isRTL } from "../../../Utils/IsRTL";

const ActivityAndFeeling = (props) => {
  const { t } = useTranslation();

  const [mainFlatList, setMainFlatList] = useState(true);
  const [tag, setTag] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [feeling, setFeeling] = useState("");
  const [image, setImage] = useState("");

  const setlist = (item) => {
    setTag(item.name);
    props.setFellingAction(item.name);
    setPlaceholder(item.placholder);
    setMainFlatList(false);

    item.name == "Feeling"
      ? setFeeling("How are you feeling?")
      : props.feelingFlatListTogle();
  };
  const setlist2 = (item) => {
    props.hideFeelings();
    setFeeling(item.name);
    props.setFellingValue(item.name);
    setImage(item.image);
    props.feelingFlatListTogle();
  };
  const closeFeeling = () => {
    setTag("");
    setMainFlatList(true);
    setFeeling("");
    setImage("");
  };
  return (
    <SafeAreaView style={styles.container}>
      {tag == "" ? (
        <View style={styles.mainheader}>
          <TouchableOpacity
            onPress={() => {
              setMainFlatList(mainFlatList), props.feelingFlatListTogle();
            }}
          >
            <Text style={styles.mainInput}>{t("What are you doing?")}</Text>
          </TouchableOpacity>
          {ICONS.antDesign(
            "closecircleo",
            COLORS.white,
            23,
            { color: COLORS.red },
            props.onPressClose
          )}
        </View>
      ) : tag != "Feeling" ? (
        <View style={styles.header}>
          <Text style={styles.selectedText}>{t(tag)}</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.input}
              value={props.feeling_value}
              onChangeText={(val) => props.setFellingValue(val)}
              onFocus={() => {
                props.setisFocus(true);
                props.setFellingValue("");
              }}
              onBlur={() => props.setisFocus(false)}
              placeholder={t(placeholder)}
            />

            <TouchableOpacity
              style={styles.iconTouch}
              onPress={() => {
                setTag(""),
                  props.setFellingValue(""),
                  setMainFlatList(true),
                  props.feelingFlatListTogle();
              }}
            >
              {ICONS.antDesign("closecircleo", COLORS.black, 23, {
                color: COLORS.red,
              })}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconTouch}
              onPress={props?.onPressTick}
            >
              {ICONS.materialCommunityIcons(
                "check-circle-outline",
                COLORS.white,
                28,
                {
                  color: COLORS.skyBlue,
                }
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.header2}>
          <Text style={styles.selectedText}>{t(tag)}</Text>
          <View style={styles.selectedFelling}>
            {image != "" ? (
              <Image style={{ width: WP(8), height: HP(4) }} source={image} />
            ) : null}
            <Text style={styles.selectedText2}>{t(feeling)}</Text>
            <TouchableOpacity
              style={{
                position: "absolute",
                right: -1,
                bottom: isRTL ? 15 : 10,
                paddingHorizontal: 5,
              }}
              onPress={() => {
                closeFeeling(), props.feelingFlatListTogle();
              }}
            >
              {ICONS.antDesign("closecircleo", COLORS.red, 20)}
            </TouchableOpacity>
          </View>
        </View>
      )}
      {props?.feelingValue ? (
        <View style={styles.feeling_label_Box}>
          <View style={styles.feeling_label_Inner}>
            {showImgFunc(props?.feelingValue, 20, 20)}
            <Text style={{ marginLeft: 5 }}>{t(props?.feelingValue)}</Text>
          </View>
        </View>
      ) : null}
      {mainFlatList ? (
        <FlatList
          data={MainArray}
          ListFooterComponent={<View style={{ height: 100 }} />}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => setlist(item)}>
                <View style={styles.itemView}>
                  <Image
                    style={{ width: WP(10), height: HP(5) }}
                    source={item.image}
                  />
                  <Text style={styles.itemText}>{t(item.name)}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : null}
      {tag == "Feeling" && image == "" ? (
        <View style={{ width: WidthScreen }}>
          <FlatList
            data={MainArray[0]?.moreData}
            ListFooterComponent={<View style={{ height: 100 }} />}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity onPress={() => setlist2(item)}>
                  <View style={styles.itemView}>
                    <Image
                      style={{ width: WP(10), height: HP(5) }}
                      source={item.image}
                    />
                    <Text style={styles.itemText}>{t(item.name)}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WidthScreen,
  },
  input: {
    height: 40,
    paddingLeft: 15,
    width: getWidth(50),
  },
  inputView: {
    height: 40,
    width: WP(70),
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 20,
  },
  mainInput: {
    paddingLeft: 15,
    flexDirection: "row",
    backgroundColor: COLORS.cocoGrey,
    borderColor: COLORS.cocoGrey,
    paddingVertical: 10,
    width: WP(80),
    borderWidth: 1,
    borderRadius: 20,
  },
  mainheader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cocoGrey,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconTouch: {
    justifyContent: "center",
    alignSelf: "center",
    paddingRight: WP(2),
    color: COLORS.red,
  },
  header: {
    flexDirection: "row",
    paddingVertical: 12,
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cocoGrey,
  },
  header2: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cocoGrey,
  },

  selectedText: {
    backgroundColor: COLORS.cocoGrey,
    padding: 9,
    borderRadius: 30,
    alignSelf: "center",
    fontWeight: "bold",
  },
  selectedText2: {
    padding: 3,
    paddingHorizontal: 10,

    alignSelf: "center",
    fontWeight: "bold",
  },
  itemView: {
    height: HP(5.5),
    marginVertical: 5,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  itemText: { fontSize: 15, fontWeight: "bold", padding: 10 },
  selectedFelling: {
    justifyContent: "space-around",
    backgroundColor: COLORS.cocoGrey,
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 15,
    left: 8,
    borderRadius: 20,
  },
  feeling_label_Box: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.cocoGrey,
    padding: 8,
    borderRadius: 20,
    margin: 10,
  },
  feeling_label_Inner: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default ActivityAndFeeling;
