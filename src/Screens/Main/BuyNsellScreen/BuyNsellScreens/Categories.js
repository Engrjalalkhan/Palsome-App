import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";

import { ActivityIndicator } from "react-native";
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from "react-native";

import { HP, WP } from "../../../../../Utils/Resposive";
import { COLORS } from "../../../../Constants/Colors.js";
import BuyNsellHeader from "../Component/HeaderComponent/index.js";
import CreateItemComponent from "../Component/CreateitemComponent.js";
import { getHeight, getWidth } from "../../../../../Utils/NewResponsive";
import CategoriesList from "../Component/BuyNsellCategoriesList/index.js";
import { withoutStringiApiCall2 } from "../../../../Services/Apis/index.js";

const Categories = ({ navigation }) => {
  const { t } = useTranslation();
  const userToken = useSelector((state) => state.auth.userToken);

  const [isCreateItem, setIsCreateItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parentCategories, setParentCategories] = useState([]);

  const categoriesApiRequest = async () => {
    setLoading(true);
    try {
      const res = await withoutStringiApiCall2({
        route: "buynsell/item/parentcategories",
        verb: "GET",
        token: userToken,
      });

      if (res?.responseCode == 200) {
        const categories = res?.payload?.data?.parent_categories;
        setParentCategories(categories);
      } else {
        console.log("Error in BuyNsell Saga", res);
        setLoading(false);
      }
    } catch (e) {
      console.log("saga error -- ", e.toString());
    }
  };

  useEffect(() => {
    categoriesApiRequest();
  }, []);

  const onPressBack = () => {
    navigation.goBack();
  };
  const onPressSubCategories = (item) => {
    navigation.navigate("SubCategories", { item: item?.id, title: item?.name });
  };
  return (
    <SafeAreaView style={styles.container}>
      <BuyNsellHeader
        onPressBack={onPressBack}
        setIsCreateItem={setIsCreateItem}
      />
      {parentCategories?.length > 0 ? (
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{t("All Categories")}</Text>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            {parentCategories?.map((item) => {
              return (
                <CategoriesList
                  data={item}
                  onPressHandle={(item) => onPressSubCategories(item)}
                />
              );
            })}
          </ScrollView>
        </View>
      ) : (
        loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size={"large"} color={COLORS.primary} />
          </View>
        )
      )}

      {isCreateItem && (
        <CreateItemComponent
          isVisible={isCreateItem}
          onDismiss={setIsCreateItem}
        />
      )}
    </SafeAreaView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  headerSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: getWidth(65),
    justifyContent: "center",
    paddingLeft: 25,
  },
  titleContainer: {
    margin: 10,
    marginHorizontal: 20,
    flex: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "left",
  },
  addIcon: {
    height: HP(4),
    width: WP(8),
    resizeMode: "contain",
  },
  buyNsellLogo: {
    height: getHeight(6),
    width: getWidth(8),
    resizeMode: "contain",
    margin: 5,
    marginTop: 8,
  },
  backIcon: {
    height: HP(3),
    resizeMode: "contain",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
