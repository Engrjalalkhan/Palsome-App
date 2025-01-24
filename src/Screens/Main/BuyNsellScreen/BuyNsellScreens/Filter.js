import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";

import { COLORS } from "../../../../Constants/Colors.js";
import { HP, WP } from "../../../../../Utils/Resposive.js";
import PickerComponent from "../Component/Picker/index.js";
import BuyNsellHeader from "../Component/HeaderComponent/index.js";
import CreateItemComponent from "../Component/CreateitemComponent.js";
import { getHeight, getWidth } from "../../../../../Utils/NewResponsive.js";
import BuyNSellTextInputComponent from "../Component/BuyNsellTextInput/index.js";
import {
  fetchCities,
  fetchEditProf,
  fetchStates,
} from "../../../../Redux/actions/ProfileActions.js";
import { withoutStringiApiCall2 } from "../../../../Services/Apis/index.js";

const FilterScreen = ({ navigation, route }) => {
  const exploreDataFromRoute = route?.params?.data; 

  

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const userToken = useSelector((state) => state.auth.userToken);
  let allStates = useSelector((state) => state.prof.states);
  let allCities = useSelector((state) => state.prof.cities);

  const [isCreateItem, setIsCreateItem] = useState(false);
  const [buttonPressed, setButtonPressed] = useState(null);
  const [countryValue, setCountryValue] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [cityId, setCityId] = useState("");
  const [stateId, setStateId] = useState("");
  const [categoriesValue, setCategoriesValue] = useState("");
  const [childCategoriesValue, setChildCategoriesValue] = useState("");

  const [countryId, setCountryId] = useState("");
  const [parentCategories, setParentCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);

  const [maxPrice, setMaxPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");

  const [parentCategoriesId, setParentCategoriesId] = useState("");
  const [childCategoriesId, setChildCategoriesId] = useState("");

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setStateValue(exploreDataFromRoute?.selected_state);
      setCityValue(exploreDataFromRoute?.selected_city);
    }
    return () => {
      isMounted = false;
    };
  }, [exploreDataFromRoute?.selected_city]);

  const countries = useSelector(
    (state) => state.prof.editProfData?.params?.countries
  );

  const dummyData = [{ title: "New" }, { title: "Used" }];
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = () => {
    dispatch(
      fetchEditProf({
        token: userToken,
      })
    );
  };

  const categoriesApiRequest = async () => {
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
  const handlePressCondition = (item, index) => {
    // return {
    //   backgroundColor:
    //     index === buttonPressed ? COLORS.primary : COLORS.tooLightGrey,
    // };
  };

  const setCategoriesPickerValue = async (val) => {
    if (val) {
      if (val !== "Select Country") {
        let conID = parentCategories?.find((itm, ind) => itm.name == val)?.id;
        setParentCategoriesId(conID);

        try {
          const res = await withoutStringiApiCall2({
            route: `buynsell/item/subcategories/${conID}`,
            verb: "GET",
            token: userToken,
          });

          if (res?.responseCode == 200) {
            const categories = res?.payload?.data?.sub_categories;
            setChildCategories(categories);
          } else {
            console.log("Error in BuyNsell Saga", res);
          }
        } catch (e) {
          console.log("saga error -- ", e.toString());
        }
      }
    }
  };

  const setCategoriesFunc = (val) => {
    setChildCategoriesValue("");
    setCategoriesValue(val);
    setCategoriesPickerValue(val);
  };

  const setChildCategoriesPickerValue = async (val) => {
    if (val) {
      if (val !== "Select Country") {
        let conID = childCategories?.find((itm, ind) => itm.name == val)?.id;
        setChildCategoriesId(conID);
      }
    }
  };

  const setChildCategoriesFunc = (val) => {
    setChildCategoriesValue(val);
    setChildCategoriesPickerValue(val);
  };

  const setCountryPickerValue = (val) => {
    console.log("vsl===", val);
    if (val) {
      if (val !== "Select Country") {
        let conID = countries?.find((itm, ind) => itm.title == val)?.id;
        setCountryId(conID);

        dispatch(
          fetchStates({
            token: userToken,
            con_id: conID,
          })
        );
      }
    }

    setCountryValue(val);
  };

  const setCountryFunc = (val) => {
    setStateValue("");
    setCityValue("");
    setStateId("");
    setCityId("");
    setCountryPickerValue(val);
  };

  const setStatePickerValue = (val) => {
    if (val) {
      let stID = allStates?.find((itm, ind) => itm.title == val)?.id;
      setStateId(stID);

      dispatch(
        fetchCities({
          token: userToken,
          id: stID,
        })
      );
    }

    setStateValue(val);
  };
  const setStateFunc = (val) => {
    setStatePickerValue(val);
    // citiesData(val);
    setCityId("");
    setCityValue();
  };

  const setCityPickerValue = (val) => {
    if (val) {
      setCityId(allCities?.find((itm, ind) => itm.title == val)?.id);
    }
    setCityValue(val);
  };

  const handleTextInputChange = (setterFunction, value) => {
    setterFunction(value);
  };

  const onPressFilterScreen = () => {
    if (minPrice > maxPrice) {
      Alert.alert(
        t("Alert!"),
        t("Minimum price can't be greater than maximum price.")
      );
    } else {
      navigation.replace("BuyNsellScreen", {
        filter: true,
        item: {
          parentCategoriesId,
          childCategoriesId,
          countryId,
          stateId,
          cityId,
          minPrice,
          maxPrice,
          countryValue,
          stateValue,
          cityValue,
        },
      });
    }
  };

  const getCountryId = () => {
    const countryItem = countries?.find(
      (itm, ind) => itm.title == exploreDataFromRoute?.selected_country
    )?.id;
    setCountryId(countryItem);
    dispatch(
      fetchStates({
        token: userToken,
        con_id: countryItem,
      })
    );

    if (countryItem) {
      setCountryValue(exploreDataFromRoute?.selected_country);
    } else {
      console.log("Error: Country not found");
    }
  };  

  const getStateId = () => {
    const countryItem = allStates?.find(
      (itm, ind) => itm.title == exploreDataFromRoute?.selected_state
    )?.id;
    setStateId(countryItem);
    dispatch(
      fetchCities({
        token: userToken,
        id: countryItem,
      })
    );

    setStateValue(exploreDataFromRoute?.selected_state);
  };

  const getCityId = () => {
    const countryItem = allCities?.find(
      (itm, ind) => itm.title == exploreDataFromRoute?.selected_city
    )?.id;
    setCityId(countryItem);
    setCityValue(exploreDataFromRoute?.selected_city);
  };

  useEffect(() => {
    getCountryId();
    getStateId();
    getCityId();
  }, [exploreDataFromRoute]);

  const onPressClearAll = () => {
    setCategoriesValue("");
    setCountryValue("");
    setStateValue("");
    setCityValue("");
    setMaxPrice("");
    setMinPrice("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <BuyNsellHeader
        onPressBack={onPressBack}
        setIsCreateItem={setIsCreateItem}
      />

      <KeyboardAwareScrollView style={styles.subContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{t("Filters")}</Text>
          <TouchableOpacity
            onPress={() => {
              onPressClearAll();
            }}
          >
            <Text style={[styles.titleText, { color: COLORS.primary }]}>
              {t("Clear all")}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.titleText, styles.pickerTextTitle]}>
          {t("Select Categories")}
        </Text>
        <View style={styles.categoriesSubContainer}>
          <PickerComponent
            title={t("Category")}
            countries={parentCategories}
            categories
            value={categoriesValue}
            setCountryPickerValue={(val) => {
              setCategoriesFunc(val);
            }}
          />
          {categoriesValue !== "" && (
            <PickerComponent
              title={t("Sub Category")}
              countries={childCategories}
              value={childCategoriesValue}
              categories
              setCountryPickerValue={(val) => {
                setChildCategoriesFunc(val);
              }}
            />
          )}
        </View>
        <Text style={[styles.titleText, styles.pickerTextTitle]}>
          {t("Select Location")}
        </Text>
        <View style={styles.categoriesSubContainer}>
          <PickerComponent
            title={t("Country")}
            countries={countries}
            value={countryValue}
            setCountryPickerValue={(val) => {
              setCountryFunc(val);
            }}
          />
          {countryValue !== "" && allStates?.length > 0 && (
            <View style={[styles.categoriesSubContainer, { left: 0 }]}>
              <PickerComponent
                title={t("State/Province")}
                countries={allStates}
                value={stateValue}
                setCountryPickerValue={(val) => {
                  setStateFunc(val);
                }}
              />
            </View>
          )}
          {allStates?.length > 0 &&
            stateValue !== "" &&
            cityValue !== "" &&
            allCities?.length > 0 && (
              <View style={[styles.categoriesSubContainer, { left: 0 }]}>
                <PickerComponent
                  title={t("City")}
                  countries={allCities}
                  value={cityValue}
                  setCountryPickerValue={(val) => {
                    setCityPickerValue(val);
                  }}
                />
              </View>
            )}
        </View>

        <Text style={[styles.titleText, { marginTop: 25 }]}>{t("Price")}</Text>
        <View style={styles.priceInput}>
          <BuyNSellTextInputComponent
            title={t("From")}
            keyboardType={"numeric"}
            value={minPrice}
            onTextChange={(text) => handleTextInputChange(setMinPrice, text)}
          />
          <BuyNSellTextInputComponent
            title={t("To")}
            keyboardType={"numeric"}
            value={maxPrice}
            onTextChange={(text) => handleTextInputChange(setMaxPrice, text)}
          />
        </View>
        {childCategories[0]?.type === "item" && (
          <>
            <Text style={[styles.titleText, { marginTop: 25 }]}>
              {t("Condition")}
            </Text>
            <View style={styles.conditionMainContainer}>
              {dummyData?.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.categoriesContainer,
                      {
                        backgroundColor:
                          buttonPressed === index
                            ? COLORS.primary
                            : COLORS.white,
                      },
                    ]}
                    onPress={() => {
                      handlePressCondition(index);
                      setButtonPressed(index);
                    }}
                  >
                    <Text
                      style={{
                        ...styles.categoriesText,
                        color:
                          buttonPressed === index
                            ? COLORS.white
                            : COLORS.primary,
                      }}
                    >
                      {item?.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
        <TouchableOpacity
          style={styles.applyButtonContainer}
          onPress={() => {
            onPressFilterScreen();
          }}
        >
          <Text style={styles.ApplyText}>{t("Apply")}</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      {isCreateItem && (
        <CreateItemComponent
          isVisible={isCreateItem}
          onDismiss={setIsCreateItem}
        />
      )}
    </SafeAreaView>
  );
};

export default FilterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    flex: 1,
    marginVertical: 10,
    marginHorizontal: 4,
    paddingHorizontal: 15,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pickerTextTitle: { marginTop: 15, marginBottom: -10 },

  priceInput: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  conditionMainContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  categoriesContainer: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    margin: 5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  categoriesSubContainer: {
    left: 2,
    marginTop: Platform.OS === "android" && 15,
  },

  categoriesText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "bold",
    paddingHorizontal: 20,
  },
  stateStyle: {
    flexDirection: "row",
    width: WP(80),
    height: HP(5),
    borderWidth: 1,
    borderColor: "#686868",
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  ApplyText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  applyButtonContainer: {
    backgroundColor: COLORS.primary,
    height: getHeight(5),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    marginTop: 50,
  },
});
