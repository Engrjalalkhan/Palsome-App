import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { HP, WP } from "../../../../../Utils/Resposive";
import { COLORS } from "../../../../Constants/Colors.js";
import BuyNsellHeader from "../Component/HeaderComponent/index.js";
import CreateItemComponent from "../Component/CreateitemComponent.js";
import CategoriesList from "../Component/BuyNsellCategoriesList/index.js";
import { getHeight, getWidth } from "../../../../../Utils/NewResponsive";
import { withoutStringiApiCall2 } from "../../../../Services/Apis/index.js";

const SubCategories = ({ navigation, route }) => {
  const userToken = useSelector((state) => state.auth.userToken);
  const { t } = useTranslation();

  const subcategoriesTitle = route?.params?.title;
  const parentId = route?.params?.item;

  const [childCategories, setChildCategories] = useState();
  const [isCreateItem, setIsCreateItem] = useState(false);
  const [loading, setLoading] = useState(false);

  const getSubCategoriesReq = async () => {
    setLoading(true);
    try {
      const res = await withoutStringiApiCall2({
        route: `buynsell/item/subcategories/${parentId}`,
        verb: "GET",
        token: userToken,
      });

      if (res?.responseCode == 200) {
        setLoading(false);
        const categories = res?.payload?.data?.sub_categories;
        setChildCategories(categories);
      } else {
        console.log("Error in BuyNsell Saga", res);
      }
    } catch (e) {
      console.log("saga error -- ", e.toString());
    }
  };

  useEffect(() => {
    getSubCategoriesReq();
  }, []);

  const onPressBack = () => {
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.container}>
      <BuyNsellHeader
        onPressBack={onPressBack}
        setIsCreateItem={setIsCreateItem}
      />
      {childCategories?.length > 0 ? (
        <View style={styles.subTitleContainer}>
          <Text style={styles.subTitleText}>{t(subcategoriesTitle)}</Text>
          <ScrollView style={{ flex: 1 }}>
            {childCategories?.map((item) => {
              return (
                <CategoriesList
                  data={item}
                  onPressHandle={() => {
                    navigation.replace("BuyNsellScreen", {
                      subCategories: true,
                      subcategoriesTitle,
                      item: {
                        item,
                      },
                    });
                  }}
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

export default SubCategories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerSubContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: getWidth(65),
    justifyContent: "center",
    paddingLeft: 25,
  },
  subTitleContainer: {
    margin: 10,
    marginHorizontal: 20,
    flex: 1,
  },
  subTitleText: {
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
