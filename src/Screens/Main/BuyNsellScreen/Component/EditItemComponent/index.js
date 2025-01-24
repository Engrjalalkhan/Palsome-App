import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";

import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../../../Utils/NewResponsive";

import { Image } from "react-native";
import Modal from "react-native-modal";
import PickerComponent from "../Picker";
import { FlatList } from "react-native";
import { HP } from "../../../../../../Utils/Resposive";
import { COLORS } from "../../../../../Constants/Colors";
import { IMAGES } from "../../../../../Constants/Images";
import { heightPercentageToDP } from "react-native-responsive-screen";
import ImagePickerModal from "../../../../../Components/ImagePickerModal";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import {
  fetchCities,
  fetchStates,
} from "../../../../../Redux/actions/ProfileActions";

import {
  postStatusApiCall,
  withoutStringiApiCall2,
} from "../../../../../Services/Apis";

import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import BuyNsellPhotoComponent from "../UploadPhotoComponent";
import { MultiSelect } from "react-native-element-dropdown";
import { imgRegex } from "../../../../../../Utils/Regexes/imgVideoRegex";

import {
  requestCameraPermission,
  requestExternalWritePermission,
} from "../../../../../../Utils/ImageAndCamera";
import { formatPrices } from "../../../../../../Utils/PriceFormate/FormatePrice";

const EditItemComponent = ({
  isVisible,
  onDismiss,
  onPressGetNewData,
  itemId,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userToken = useSelector((state) => state.auth.userToken);

  const countries = useSelector(
    (state) => state.prof.editProfData?.params?.countries
  );
  let allStates = useSelector((state) => state.prof.states);
  let allCities = useSelector((state) => state.prof.cities);
  const parentCategoryData = useSelector(
    (state) => state.buyNsellRed.parentCategoriesData
  );

  const [city, setCity] = useState();
  const [data, setData] = useState();
  const [state, setState] = useState();
  const [price, setPrice] = useState();
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState();
  const [cityId, setCityId] = useState("");
  const [stateId, setStateId] = useState("");
  const [editData, setEditData] = useState();
  const [currency, setCurrency] = useState("");
  const [parentId, setParentId] = useState("");
  const [myImages, setMyImages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cityValue, setCityValue] = useState("");
  const [editCityId, setEditCityId] = useState();
  const [yearValue, setYearValue] = useState("");
  const [countryId, setCountryId] = useState("");
  const [editStateId, setEditStateId] = useState();
  const [stateValue, setStateValue] = useState("");
  const [subChildData, setSubChildData] = useState();
  const [description, setDescription] = useState("");
  const [parentIdEdit, setParentIdEdit] = useState();
  const [countryValue, setCountryValue] = useState("");
  const [deletedItems, setDeletedItems] = useState([]);
  const [onlyNewFiles, setOnlyNewFiles] = useState([]);
  const [editCountryId, setEditCountryId] = useState();
  const [deleteItemUri, setDeleteItemUri] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [multipleImages, setMultipleImages] = useState([]);
  const [makeInputValue, setMakeInputValue] = useState("");
  const [areaInputValue, setAreaInputValue] = useState("");
  const [childCategories, setChildCategories] = useState([]);
  const [categoriesValue, setCategoriesValue] = useState("");
  const [modelInputValue, setModelInputValue] = useState("");
  const [subCategoriesId, setSubCategoriesId] = useState("");
  const [subChildAllData, setSubChildAllData] = useState("");
  const [brandInputValue, setBrandInputValue] = useState("");
  const [selectedFeatures, setSelectedFeature] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [filesTitlesArray, setFilesTitlesArray] = useState([]);
  const [childCategoriesValue, setChildCategoriesValue] = useState("");
  const [pickerModalVisibile, setPickerModalVisibile] = useState(false);
  const [iosDatePickerVisible, setIosDatePickerVisible] = useState(false);
  const [subChildCategoriesValue, setSubChildCategoriesValue] = useState("");

  const Picker = [
    { label: "Other", value: "other" },
    { label: "Corner Plot", value: "corner Plot" },
    { label: "Park Facing", value: "park Facing" },
    { label: "Disputed", value: "disputed" },
    { label: "Sewerage", value: "sewerage" },
    { label: "Electricity", value: "electricity" },
    { label: "Water Supply", value: "Water Supply" },
    { label: "Gas Supply", value: "gas-supply" },
    { label: "Boundry Wall", value: "boundry Wall" },
  ];

  useEffect(() => {
    const selectedData = features
      .map((item) => {
        const selectedItem = Picker.find(
          (pickerItem) =>
            pickerItem.value.toLowerCase() === item?.feature_name.toLowerCase()
        );
        return selectedItem ? selectedItem.value : null;
      })
      .filter(Boolean);
    setSelectedFeature(selectedData);
  }, [features]);

  const imagePickingLimit = 8;

  const imageCondition = multipleImages?.length === imagePickingLimit;

  const handleUploadPhoto = () => {};
  const captureImage = async (contentType) => {
    let options = {
      mediaType: contentType,
      quality: 1,
      noData: true,
      videoQuality: "high",
      durationLimit: 30,
    };

    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted) {
      launchCamera(options, (response) => {
        if (response.didCancel) {
          return;
        } else if (response.errorCode == "camera_unavailable") {
          return;
        } else if (response.errorCode == "permission") {
          return;
        } else if (response.errorCode == "others") {
          return;
        }
        // let uri = response?.assets[0]?.uri;
        // let type = response?.assets[0]?.type
        //   ? response?.assets[0]?.type
        //   : "video/mp4";
        // let name = response?.assets[0]?.fileName;

        if (response?.assets?.length) {
          setMultipleImages((prev) => {
            let newImgs = response?.assets?.map((item, index) => {
              return {
                uri: item?.uri,
                type: item?.type ? item?.type : "video/mp4",
                name: item?.fileName,
              };
            });

            return prev.concat(newImgs);
          });

          //   snapURI ? setSnapURI("") : null;
        }

        //to solve error
        if (response?.assets?.length) {
          setOnlyNewFiles((prev) => {
            let newImgs = response?.assets?.map((item, index) => {
              return {
                uri: item?.uri,
                type: item?.type ? item?.type : "video/mp4",
                name: item?.fileName,
              };
            });

            return prev.concat(newImgs);
          });
        }

        setPickerModalVisibile(false);
      });
    }
  };
  const chooseImageGallery = () => {
    let options = {
      mediaType: "photo",
      quality: 1,
      noData: true,

      selectionLimit: imagePickingLimit - multipleImages?.length,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled camera picker");

        return;
      } else if (response.errorCode == "camera_unavailable") {
        console.log("Camera not available on device");

        return;
      } else if (response.errorCode == "permission") {
        console.log("Permission not satisfied");

        return;
      } else if (response.errorCode == "others") {
        console.log(response.errorMessage);

        return;
      }

      if (response.assets.length) {
        let temp = response.assets.map((item, index) => {
          return {
            uri: item.uri.match(imgRegex) ? item.uri : item.uri,
            type:
              Platform.OS === "ios" && item?.type == "video/quicktime"
                ? "mov"
                : Platform.OS === "android" && item?.type == "video/mp4"
                ? "video/mp4"
                : item?.type == "image/jpg"
                ? "jpg"
                : item?.type == "image/png"
                ? "jpg"
                : (Platform.OS === "ios" && item?.type == "image/jpg") ||
                  item?.type == "image/png" ||
                  item?.type == "heic"
                ? "heic"
                : item?.type,
            name: item.uri.match(imgRegex)
              ? item.fileName
              : item.fileName + ".mp4",
          };
        });

        if (temp.length + multipleImages.length > imagePickingLimit) {
          Toast.show(
            `only ${imagePickingLimit} media items are allowed`,
            Toast.SHORT
          );
          return;
        } else {
          setMultipleImages(multipleImages.concat(temp));
          setOnlyNewFiles(temp);
          setPickerModalVisibile(false);
        }
      }
    });
  };
  const deleteItem = (item, itemIndex, shouldDeleteMedia = false) => {
    const URI =
      (item.uri ? item.uri.replace("https://www.palsome.com/", "") : "") ||
      (item?.file_path
        ? item.file_path.replace("https://www.palsome.com/", "")
        : "");

    const encryptedId = item?.encrypted_id;

    // setDeleteItemUri(URI);
    setDeleteItemUri((prevIds) => [...prevIds, encryptedId]);

    const filteredMultiple = multipleImages.filter(
      (_, index) => index !== itemIndex
    );

    setMultipleImages(filteredMultiple);
    setFilteredImages(filteredMultiple);

    const filteredOnlyNew = onlyNewFiles.filter((i) => i.uri !== item.uri);
    setOnlyNewFiles(filteredOnlyNew);

    setFilesTitlesArray((prev) => {
      const newTitle = "";
      return prev.concat(newTitle);
    });
  };

  const onPressImage = () => {
    console.log("image pressed");
  };

  const setCountryPickerValue = (val) => {
    if (val) {
      if (val !== "Select Country") {
        let conID = countries?.find((itm, ind) => itm.title == val)?.id;
        setCountryId(conID);
        let conTitle = countries?.find((itm) => itm.title === val).currency;
        setCurrency(conTitle);

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

  // const categoriesApiRequest = async () => {
  //   try {
  //     const res = await withoutStringiApiCall2({
  //       route: "buynsell/item/parentcategories",
  //       verb: "GET",
  //       token: userToken,
  //     });

  //     if (res?.responseCode == 200) {
  //       const categories = res?.payload?.data?.parent_categories;
  //       setParentCategories(categories);
  //     } else {
  //       console.log("Error in BuyNsell Saga", res);
  //     }
  //   } catch (e) {
  //     console.log("saga error -- ", e.toString());
  //   }
  // };

  // useEffect(() => {
  //   categoriesApiRequest();
  // }, []);

  const currentYear = new Date().getFullYear();
  let years = [];

  for (let year = currentYear; year >= 1900; year--) {
    years.push(year);
  }
  const transformedYears = years.map((year) => {
    return { name: year.toString(), value: year };
  });

  const setCategoriesPickerValue = async (val) => {
    if (val) {
      if (val !== "Select Country") {
        let conID = parentCategoryData?.find((itm, ind) => itm.name == val)?.id;
        setParentId(conID);
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
    setYearValue("");
    setBrandInputValue("");
    setSubChildData("");
    setSubChildCategoriesValue("");
    setChildCategoriesValue("");
    setCategoriesValue(val);
    setCategoriesPickerValue(val);
  };
  const setChildCategoriesPickerValue = async (val) => {
    if (val) {
      if (val !== "Select Country") {
        // let conID = childCategories?.find((itm, ind) => {
        //   return itm.name === val;
        // });
        // let result = conID
        //   ? { parent_id: conID.parent_id, id: conID.id }
        //   : null;

        // let parent_id = result.parent_id;
        // let id = result.id;

        // setSubCategoriesId(id);

        try {
          const res = await withoutStringiApiCall2({
            route: `buynsell/item/subcategories/${parentIdEdit}/extra_data`,
            verb: "GET",
            token: userToken,
          });

          if (res?.responseCode == 200) {
            if (res?.payload?.data?.extra_data?.condition) {
              setSubChildData(res?.payload?.data?.extra_data?.condition);
            } else if (res?.payload?.data?.extra_data?.fuel_type) {
              setSubChildData(res?.payload?.data?.extra_data?.fuel_type);
            } else if (res?.payload?.data?.extra_data?.area_unit) {
              setSubChildData(res?.payload?.data?.extra_data?.area_unit);
            } else {
              setSubChildData();
            }
            setSubChildAllData(res?.payload?.data?.type);
          } else {
            console.log("Error in BuyNsell Saga", res);
          }
        } catch (e) {
          console.log("saga error -- ", e.toString());
        }
      }
    }
  };

  const setChildCategoriesFunc = (val) => {
    setChildCategoriesValue(val);
    setChildCategoriesPickerValue(parentIdEdit);
  };

  useEffect(() => {
    setChildCategoriesFunc();
  }, [parentIdEdit]);

  const setSubChildCategoriesFunc = (val) => {
    setSubChildCategoriesValue(val);
  };

  const setYearsFunc = (val) => {
    setYearValue(val);
  };

  const onPressUpdate = async (val) => {
    setTimeout(() => {
      onDismiss(false);
    }, 500);
    setTimeout(() => {
      Toast.show("Updating...");
    }, 1000);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("country", countryId);
    formData.append("states", stateId ? stateId : "");
    formData.append("city", cityId ? cityId : "");
    formData.append("brand", brandInputValue);
    formData.append("condition", subChildCategoriesValue.toLocaleLowerCase());
    formData.append("item_type", subChildAllData);
    formData.append("parent_category", parentIdEdit);
    formData.append("make", makeInputValue);
    formData.append("model", modelInputValue);
    formData.append("fuel", "petrol");

    formData.append("sub_category", subCategoriesId);
    formData.append("description", description);
    var featuresArray = selectedFeatures;
    var featuresString = featuresArray.join(",");
    formData.append("features", featuresString);
    formData.append("area_unit", subChildCategoriesValue);

    {
      yearValue && formData.append("year", yearValue);
    }
    {
      areaInputValue && formData.append("area", areaInputValue);
    }
    {
      val === "Draft" && formData.append("add_in_draft", "true");
    }

    if (onlyNewFiles?.length > 0) {
      onlyNewFiles.forEach((item, index) => {
        formData.append(`item_file[${index}]`, item);
      });
    } else {
      multipleImages.forEach((item, index) => {
        formData.append("picture_id", JSON.stringify(item));
      });
    }
    var featuresArray = deleteItemUri;
    var featuresString = featuresArray.join(",");

    formData.append(`remove_file_id`, featuresString);

    try {
      const res = await postStatusApiCall({
        route: `buynsell/item/update/${itemId}`,
        verb: "POST",
        token: userToken,
        body: formData,
      });

      if (res?.responseCode === 200) {
        setTimeout(() => {
          Toast.show(res?.message, Toast.LONG);
        }, 1000);
        onPressGetNewData(val);
      } else {
        Toast.show(res?.message);
      }
    } catch (e) {
      console.log("saga update error----- ", e.toString());
    }
  };

  const getEditItemApiRequest = async () => {
    setLoading(true);
    try {
      const res = await withoutStringiApiCall2({
        route: `buynsell/item/${itemId}/edit`,
        verb: "GET",
        token: userToken,
      });
      if (res?.responseCode === 200) {
        const marketplaceData = res?.payload?.data?.marketplace;
        const countries = res?.payload?.data?.countries;

        const states = res?.payload?.data?.states;
        const cities = res?.payload?.data?.cities;
        setCountry(countries);

        setCurrency(
          countries?.find((item) => item?.id === marketplaceData?.country_id)
            ?.currency
        );
        setState(states);
        setCity(cities);
        setEditData(marketplaceData);
        setTitle(marketplaceData?.title);
        setPrice(marketplaceData?.price / 100);
        // setPrice(formatPrices(marketplaceData?.price));
        setDescription(marketplaceData?.description);
        setCountryId(marketplaceData?.country_id);
        setStateId(marketplaceData?.state_id);
        setCityId(marketplaceData?.city_id);
        const countryItem = countries?.find(
          (item) => item?.id === marketplaceData?.country_id
        );
        dispatch(
          fetchStates({
            token: userToken,
            con_id: marketplaceData?.country_id,
          })
        );
        if (countryItem) {
          setCountryValue(countryItem.title);
        } else {
          console.log("Error: Country not found");
        }
        const stateItem = states?.find(
          (item) => item?.id === marketplaceData?.state_id
        );
        if (stateItem) {
          setStateValue(stateItem.title);
        } else {
          console.log("Error: State not found");
        }
        const cityItem = cities?.find(
          (item) => item?.id === marketplaceData?.city_id
        );
        dispatch(
          fetchCities({
            token: userToken,
            id: marketplaceData?.state_id,
          })
        );
        if (cityItem) {
          setCityValue(cityItem.title);
        } else {
          console.log("Error: State not found");
        }

        setFeatures(marketplaceData?.features);

        setMultipleImages(marketplaceData?.marketmedia);
        setBrandInputValue(marketplaceData?.brand);
        setParentIdEdit(marketplaceData?.market_place_categories?.parent_id);

        const { condition, fuel, area_unit } = marketplaceData;
        if (condition !== null) {
          setSubChildCategoriesValue(condition);
        } else if (fuel !== null) {
          setSubChildCategoriesValue(fuel);
        } else if (area_unit !== null) {
          setSubChildCategoriesValue(area_unit);
        }

        setYearValue(marketplaceData?.year);
        setAreaInputValue(marketplaceData?.area);
        setModelInputValue(marketplaceData?.Model);
        setMakeInputValue(marketplaceData?.make);
        setSubChildAllData(marketplaceData?.market_place_categories?.type);
        setSubCategoriesId(marketplaceData?.category_id);
      } else {
        console.log("Error in BuyNsell Saga", res);
      }
    } catch (error) {
      console.log("saga error -- ", error.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEditItemApiRequest();
  }, []);

  const itemCondition =
    !title ||
    !price ||
    !country ||
    (state?.length > 0 && stateValue === "") ||
    (city?.length > 0 && cityValue === undefined) ||
    (cityValue === "undefined" && state?.length > 0) ||
    !description ||
    !brandInputValue ||
    !subChildCategoriesValue ||
    (multipleImages && multipleImages.length === 0);

  const vehicleCondition =
    !title ||
    !price ||
    !country ||
    (state?.length > 0 && stateValue === "") ||
    (city?.length > 0 && cityValue === undefined) ||
    (cityValue === "undefined" && state?.length > 0) ||
    !description ||
    !makeInputValue ||
    !modelInputValue ||
    !yearValue ||
    !subChildCategoriesValue ||
    (multipleImages && multipleImages.length === 0);

  const propertyCondition =
    !title ||
    !price ||
    !country ||
    (state?.length > 0 && stateValue === "") ||
    (city?.length > 0 && cityValue === undefined) ||
    (cityValue === "undefined" && state?.length > 0) ||
    !description ||
    !areaInputValue ||
    !subChildCategoriesValue ||
    selectedFeatures?.length === 0 ||
    (multipleImages && multipleImages.length === 0);

  const condition =
    subChildAllData === "item"
      ? itemCondition
      : subChildAllData === "vehicle"
      ? vehicleCondition
      : propertyCondition;
  const buttonStyle = condition ? styles.disabledButton : styles.button;

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onDismiss}
      animationIn="fadeInUp"
      animationOut="zoomOutDown"
      animationInTiming={300}
      animationOutTiming={500}
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}
      style={styles.modalContainer}
    >
      <View
        style={[
          styles.modalContent,
          { height: !multipleImages ? getHeight(90) : null },
        ]}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{t("Edit Item For Sale")}</Text>
          <TouchableOpacity
            onPress={() => {
              onDismiss(false);
            }}
          >
            <Image source={IMAGES.crossIcon} style={styles.crossIcon} />
          </TouchableOpacity>
        </View>
        {!loading ? (
          <KeyboardAwareScrollView>
            <View style={{ padding: 20 }}>
              <TextInput
                placeholder={t("Title")}
                placeholderTextColor={COLORS.grey}
                value={title}
                onChangeText={(text) => setTitle(text)}
                style={[styles.input, { right: 6 }]}
              />
              <View style={styles.priceInputContainer}>
                <TextInput
                  placeholder={t("Price")}
                  placeholderTextColor={COLORS.grey}
                  value={price ? price.toString() : null}
                  keyboardType="numeric"
                  // onChangeText={(text) => setPrice(text)}
                  onChangeText={(text) => {
                    let formattedText = text.replace(/,/g, ".");
                    if (formattedText.match(/^\d*\.?\d{0,2}$/)) {
                      setPrice(formattedText);
                    }
                  }}
                  style={[styles.input, { right: 6, paddingRight: 100 }]}
                />
                <View style={styles.currencyContainer}>
                  <Text style={styles.currencyText}>
                    {currency ? currency : "--"}
                  </Text>
                </View>
              </View>
              <View style={styles.dropdown}>
                <View style={styles.pickerStyle}>
                  <PickerComponent
                    title={t("Country")}
                    countries={countries}
                    value={countryValue}
                    setCountryPickerValue={(val) => {
                      setCountryFunc(val);
                    }}
                  />
                </View>
                <View style={styles.pickerStyle}>
                  {countryValue !== "" && allStates?.length > 0 && (
                    <PickerComponent
                      title={t("State/Province")}
                      countries={allStates}
                      value={stateValue}
                      setCountryPickerValue={(val) => {
                        setStateFunc(val);
                      }}
                    />
                  )}
                </View>

                <View style={styles.pickerStyle}>
                  {allStates?.length > 0 &&
                    stateValue !== "" &&
                    cityValue !== "" &&
                    allCities?.length > 0 && (
                      <PickerComponent
                        title={t("City")}
                        countries={allCities}
                        value={cityValue}
                        setCountryPickerValue={(val) => {
                          setCityPickerValue(val);
                        }}
                      />
                    )}
                </View>
              </View>

              <View style={{ marginTop: 0 }}>
                {subChildAllData === "item" && (
                  <View style={[styles.pickerStyle, { top: 17 }]}>
                    <TextInput
                      placeholder={t("Brand")}
                      placeholderTextColor={COLORS.grey}
                      value={brandInputValue}
                      onChangeText={(text) => setBrandInputValue(text)}
                      style={styles.input}
                    />
                  </View>
                )}

                {subChildAllData === "vehicle" && (
                  <View style={[styles.pickerStyle, { top: 17 }]}>
                    <TextInput
                      placeholder={t("Make")}
                      placeholderTextColor={COLORS.grey}
                      value={makeInputValue}
                      onChangeText={(text) => setMakeInputValue(text)}
                      style={styles.input}
                    />
                    <TextInput
                      placeholder={t("Model")}
                      placeholderTextColor={COLORS.grey}
                      value={modelInputValue}
                      onChangeText={(text) => setModelInputValue(text)}
                      style={styles.input}
                    />
                  </View>
                )}

                {subChildAllData === "property" && (
                  <View style={[styles.pickerStyle, { top: 17 }]}>
                    <TextInput
                      placeholder={t("Area")}
                      value={areaInputValue ? areaInputValue.toString() : null}
                      onChangeText={(text) => setAreaInputValue(text)}
                      style={styles.input}
                    />
                  </View>
                )}

                {subChildAllData === "vehicle" && (
                  <PickerComponent
                    title={t("Fuel Type")}
                    countries={subChildData}
                    value={subChildCategoriesValue}
                    categories
                    setCountryPickerValue={(val) => {
                      setSubChildCategoriesFunc(val);
                    }}
                  />
                )}

                {subChildAllData === "item" && (
                  <PickerComponent
                    title={t("Condition")}
                    countries={subChildData}
                    value={subChildCategoriesValue}
                    categories
                    setCountryPickerValue={(val) => {
                      setSubChildCategoriesFunc(val);
                    }}
                  />
                )}

                {subChildAllData === "property" && (
                  <PickerComponent
                    title={t("Select Area Unit")}
                    countries={subChildData}
                    value={subChildCategoriesValue}
                    categories
                    setCountryPickerValue={(val) => {
                      setSubChildCategoriesFunc(val);
                    }}
                  />
                )}

                {subChildAllData === "property" && (
                  <View>
                    <MultiSelect
                      style={styles.dropdownElement}
                      selectedTextStyle={styles.selectedTextStyle}
                      placeholder={t("Select Features")}
                      value={selectedFeatures}
                      labelField="label"
                      valueField="value"
                      data={Picker}
                      onChange={(item) => {
                        setSelectedFeature(item);
                      }}
                    />
                  </View>
                )}
                {subChildAllData === "vehicle" && (
                  <PickerComponent
                    title={t("Year")}
                    countries={transformedYears}
                    value={yearValue}
                    categories
                    setCountryPickerValue={(val) => {
                      setYearsFunc(val);
                    }}
                  />
                )}
              </View>

              <Text style={styles.uploadUptoImages}>
                {t("Upload upto 8 images")}:
              </Text>

              <TouchableOpacity
                disabled={imageCondition}
                style={
                  imageCondition
                    ? [styles.uploadBox, { opacity: 0.4 }]
                    : styles.uploadBox
                }
                onPress={() => setPickerModalVisibile(true)}
              >
                <Image
                  source={IMAGES.addUploadIcon}
                  style={styles.addUploadIcon}
                />
                <Text>{t("Upload Photo")}</Text>
              </TouchableOpacity>
              {multipleImages?.length > 0 ? (
                <View style={styles.body}>
                  <>
                    {multipleImages?.length ? (
                      <View style={{ height: HP(15) }}>
                        <FlatList
                          showsHorizontalScrollIndicator={false}
                          data={multipleImages}
                          // data={[...existingFile, multipleImages]}
                          //   renderItem={({ item }) =>
                          //     PostModalImgDocx(item, deleteItem, onPressImage)
                          //   }
                          renderItem={({ item, index }) => (
                            <View>
                              <BuyNsellPhotoComponent
                                item={item}
                                onPressImage={(e) => {
                                  "";
                                }}
                                deleteItem={() => deleteItem(item, index)}
                              />
                            </View>
                          )}
                          horizontal={true}
                          style={{ flex: 1 }}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      </View>
                    ) : (
                      <View
                        style={[
                          styles.imageToUpload,
                          styles.imageToUploadPlaceHolder,
                          { height: HP(15) },
                        ]}
                      ></View>
                    )}
                  </>
                </View>
              ) : null}
              <View style={styles.descriptionContainer}>
                <TextInput
                  placeholder={t("Description")}
                  value={description}
                  multiline
                  onChangeText={(text) => setDescription(text)}
                  style={{ padding: 10 }}
                  placeholderTextColor={COLORS.darkGray}
                />
              </View>
            </View>
            <ImagePickerModal
              visible={pickerModalVisibile}
              hideVisible={() => setPickerModalVisibile(false)}
              galleryImage={() => chooseImageGallery()}
              cameraImage={() => captureImage("image")}
              //   pdfPick={() => pickPdf()}
              showOpenVidcamera={false}
              showOpenImgcamera={true}
              showOpenPdf={false}
            />
          </KeyboardAwareScrollView>
        ) : (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size={"large"} color={COLORS.primary} />
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            disabled={condition}
            style={buttonStyle}
            onPressIn={() => {
              onPressUpdate();
            }}
          >
            <Text style={styles.textStyle}>{t("Update")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    margin: 5,
    maxHeight: getHeight(78),
    marginTop: heightPercentageToDP(6),
  },
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    // padding: 20,
    borderRadius: 10,
  },

  headerContainer: {
    backgroundColor: "#fff",
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    height: 60,
    width: getWidth(98),
    justifyContent: "space-between",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  pickerStyle: {
    width: getWidth(28),
    margin: Platform.OS == "ios" ? 5 : 0,
    marginTop: Platform.OS === "android" ? 5 : 0,
  },
  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 7,
    padding: 10,
    width: getWidth(88.5),
    right: Platform.OS === "ios" ? 8 : 7,
  },
  brandInput: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 7,
    padding: 10,
  },
  descriptionContainer: {
    height: getHeight(15),
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    // width: getWidth(98),
    marginTop: heightPercentageToDP(3),
    marginVertical: 20,
  },
  uploadBox: {
    height: getHeight(15),
    borderWidth: 1.5,
    borderStyle: "dotted",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderStyle: "dotted",
    borderColor: COLORS.darkGray,
    borderRadius: 7,
    marginTop: 10,
  },
  uploadUptoImages: {
    marginVertical: 5,
    top: 5,
    fontWeight: "bold",
  },

  dropdown: {
    flexDirection: Platform.OS === "ios" ? "row" : "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "ios" ? -15 : -5,
  },

  DisButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    backgroundColor: "#cccccc",
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    backgroundColor: "#DF4B38",
    width: getWidth(85),
    alignItems: "center",
    justifyContent: "center",
    height: getHeight(5),
  },
  disabledButton: {
    backgroundColor: "#6c757d",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: getWidth(85),
    alignItems: "center",
    justifyContent: "center",
    height: getHeight(5),
  },
  textStyle: {
    color: COLORS.white,
    fontSize: getFontSize(2),
    fontWeight: "bold",
  },
  crossIcon: {
    height: 25,
    width: 30,
    resizeMode: "contain",
  },
  addUploadIcon: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    margin: 5,
  },
  body: {
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownElement: {
    marginTop: 15,
    height: 50,
    borderColor: COLORS.cocoGrey,
    borderWidth: 0.5,
    width: getWidth(88.5),
    borderRadius: 10,
    padding: 12,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 8,
    color: COLORS.primary,
    // margin: 10,
  },
  priceInputContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  currencyContainer: {
    position: "absolute",
    right: 15,
    bottom: 15,
    borderLeftWidth: 0.5,
    borderLeftColor: COLORS.grey,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 70,
  },
  currencyText: {
    padding: 15,
    color: COLORS.black,
    fontWeight: "600",
    textTransform: "uppercase",
  },
};

export default EditItemComponent;
