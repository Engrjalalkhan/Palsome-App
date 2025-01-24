import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  Platform,
  TextInput,
  TouchableOpacity,
} from "react-native";

import {
  getWidth,
  getHeight,
  getFontSize,
} from "../../../../../../Utils/NewResponsive";

import { Image } from "react-native";
import Modal from "react-native-modal";
import { FlatList } from "react-native";
import PickerComponent from "../Picker";
import Toast from "react-native-simple-toast";
import { HP } from "../../../../../../Utils/Resposive";
import { useDispatch, useSelector } from "react-redux";
import { COLORS } from "../../../../../Constants/Colors";
import { IMAGES } from "../../../../../Constants/Images";
import { MultiSelect } from "react-native-element-dropdown";
import { heightPercentageToDP } from "react-native-responsive-screen";
import ImagePickerModal from "../../../../../Components/ImagePickerModal";
import PostModalImgDocx from "../../../../../Components/PostModalImgDocx";
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

import {
  requestCameraPermission,
  requestExternalWritePermission,
} from "../../../../../../Utils/ImageAndCamera";

const CreateItemComponent = ({ isVisible, onDismiss, onPressGetNewData }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  let allStates = useSelector((state) => state.prof.states);
  let allCities = useSelector((state) => state.prof.cities);

  const userToken = useSelector((state) => state.auth.userToken);

  const countries = useSelector(
    (state) => state.prof.editProfData?.params?.countries
  );

  const parentCategoryData = useSelector(
    (state) => state.buyNsellRed.parentCategoriesData
  );

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [cityId, setCityId] = useState("");
  const [stateId, setStateId] = useState("");
  const [currency, setCurrency] = useState("");
  const [parentId, setParentId] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [countryId, setCountryId] = useState("");
  const [yearValue, setYearValue] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [subChildData, setSubChildData] = useState();
  const [description, setDescription] = useState("");
  const [onlyNewFiles, setOnlyNewFiles] = useState([]);
  const [countryValue, setCountryValue] = useState("");
  const [deleteItemUri, setDeleteItemUri] = useState([]);
  const [areaInputValue, setAreaInputValue] = useState("");
  const [makeInputValue, setMakeInputValue] = useState("");
  const [filteredImages, setFilteredImages] = useState([]);
  const [multipleImages, setMultipleImages] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [categoriesValue, setCategoriesValue] = useState("");
  const [subCategoriesId, setSubCategoriesId] = useState("");
  const [subChildAllData, setSubChildAllData] = useState("");
  const [brandInputValue, setBrandInputValue] = useState("");
  const [modelInputValue, setModelInputValue] = useState("");
  const [selectedFeatures, setSelectedFeature] = useState([]);
  const [filesTitlesArray, setFilesTitlesArray] = useState([]);
  const [childCategoriesValue, setChildCategoriesValue] = useState("");
  const [pickerModalVisibile, setPickerModalVisibile] = useState(false);
  const [subChildCategoriesValue, setSubChildCategoriesValue] = useState("");

  const imagePickingLimit = 8;

  const imageCondition = multipleImages?.length === imagePickingLimit;

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
        return;
      } else if (response.errorCode == "camera_unavailable") {
        return;
      } else if (response.errorCode == "permission") {
        return;
      } else if (response.errorCode == "others") {
        return;
      }
      console.log("response", response);
      let uri = response?.assets[0]?.uri;

      if (response.assets.length) {
        setMultipleImages((prev) => {
          const newImgs = response?.assets?.map((item, index) => {
            return {
              uri: item?.uri,
              type: item?.type ? item.type : "image/jpg",
              name: item?.fileName,
            };
          });
          return prev.concat(newImgs);
        });
        setFilesTitlesArray((prev) => {
          const newTitle = "";
          return prev.concat(newTitle);
        });
      }

      if (response.assets.length) {
        setOnlyNewFiles((prev) => {
          const newImgs = response?.assets?.map((item, index) => {
            return {
              uri: item?.uri,
              type: item?.type
                ? item.type
                : "image/jpg" || "image/jpeg" || "image/png",
              name: item?.fileName,
            };
          });
          return prev.concat(newImgs);
        });

        setFilesTitlesArray((prev) => {
          const newTitle = "";
          return prev.concat(newTitle);
        });
      }

      setPickerModalVisibile(false);
    });
    setMultipleImages(multipleImages);
  };
  const deleteItem = (item) => {
    const URI = item.uri.replace("https://www.palsome.com/", "");
    // setDeleteItemUri(URI);
    setDeleteItemUri((prev) => [...prev, URI]);

    const filteredMultiple = multipleImages.filter((i) => i.uri !== item.uri);
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
        let conTitle = countries?.find((itm) => itm.title === val).currency;
        setCurrency(conTitle);
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

  const categoriesApiRequest = async () => {
    // try {
    //   const res = await withoutStringiApiCall2({
    //     route: "buynsell/item/parentcategories",
    //     verb: "GET",
    //     token: userToken,
    //   });
    //   if (res?.responseCode == 200) {
    //     const categories = res?.payload?.data?.parent_categories;
    //     setParentCategories(categories);
    //   } else {
    //     console.log("Error in BuyNsell Saga", res);
    //   }
    // } catch (e) {
    //   console.log("saga error -- ", e.toString());
    // }
  };

  useEffect(() => {
    categoriesApiRequest();
  }, []);

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
        let conID = childCategories?.find((itm, ind) => {
          return itm.name === val;
        });
        let result = conID
          ? { parent_id: conID.parent_id, id: conID.id }
          : null;

        let parent_id = result.parent_id;
        let id = result.id;

        setSubCategoriesId(id);

        try {
          const res = await withoutStringiApiCall2({
            route: `buynsell/item/subcategories/${parent_id}/extra_data`,
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
    setChildCategoriesPickerValue(val);
  };

  const setSubChildCategoriesFunc = (val) => {
    setSubChildCategoriesValue(val);
  };

  const setYearsFunc = (val) => {
    setYearValue(val);
  };

  const onPressPost = async (val) => {
    if (val === "Draft") {
      if (!title) {
        Toast.show(t("The title field is required"));
        return;
      } else if (!price) {
        Toast.show(t("The price field is required"));
        return;
      }
    }

    setTimeout(() => {
      onDismiss(false);
    }, 500);
    setTimeout(() => {
      Toast.show("Creating...");
    }, 1000);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", price);
    formData.append("country", countryId);
    formData.append("states", stateId);
    formData.append("city", cityId);
    formData.append("parent_category", parentId);
    formData.append("sub_category", subCategoriesId);
    formData.append("description", description);
    formData.append("item_type", subChildAllData);
    formData.append("brand", brandInputValue);

    {
      subChildAllData === "item" &&
        formData.append(
          "condition",
          subChildCategoriesValue.toLocaleLowerCase()
        );
    }
    {
      subChildAllData === "vehicle" &&
        formData.append("fuel", subChildCategoriesValue);
    }
    {
      subChildAllData === "property" &&
        formData.append("area_unit", subChildCategoriesValue);
    }
    var featuresArray = selectedFeatures;
    var featuresString = featuresArray.join(",");
    formData.append("features", featuresString);

    {
      makeInputValue && formData.append("make", makeInputValue);
    }
    {
      modelInputValue && formData.append("model", modelInputValue);
    }
    {
      yearValue && formData.append("year", yearValue);
    }
    {
      areaInputValue && formData.append("area", areaInputValue);
    }
    {
      val === "Draft" && formData.append("add_in_draft", true);
    }

    multipleImages?.map((item, index) => {
      formData.append(`item_file[]`, item);
    });
    try {
      const res = await postStatusApiCall({
        route: "buynsell/item/store",
        verb: "POST",
        token: userToken,
        body: formData,
      });

      if (res?.responseCode === 200) {
        setTimeout(() => {
          if (val === "Draft") {
            Toast.show(t("Your ad saved in draft"));
          } else {
            Toast.show(t(res?.message), Toast.LONG);
          }
        }, 1000);
        onPressGetNewData(val);
      } else {
        Toast.show(res?.message);
      }
    } catch (e) {
      console.log("saga update error----- ", e.toString());
    }
  };
  const Picker = [
    { label: t("Other"), value: "other" },
    { label: t("Corner Plot"), value: "corner Plot" },
    { label: t("Park Facing"), value: "park Facing" },
    { label: t("Disputed"), value: "disputed" },
    { label: t("Sewerage"), value: "sewerage" },
    { label: t("Electricity"), value: "electricity" },
    { label: t("Water Supply"), value: "Water Supply" },
    { label: t("Gas Supply"), value: "gas-supply" },
    { label: t("Boundry Wall"), value: "boundry Wall" },
  ];

  const itemCondition =
    !title ||
    !price ||
    !countries ||
    (allStates?.length > 0 && stateValue === "") ||
    (allCities?.length > 0 && cityValue === undefined) ||
    (cityValue === "undefined" && allCities?.length > 0) ||
    !parentId ||
    !subCategoriesId ||
    !description ||
    !brandInputValue ||
    !subChildCategoriesValue ||
    (multipleImages && multipleImages.length === 0);

  const vehicleCondition =
    !title ||
    !price ||
    !countries ||
    (allStates?.length > 0 && stateValue === "") ||
    (allCities?.length > 0 && cityValue === undefined) ||
    (cityValue === "undefined" && allCities?.length > 0) ||
    !parentId ||
    !subCategoriesId ||
    !description ||
    !makeInputValue ||
    !modelInputValue ||
    !yearValue ||
    !subChildCategoriesValue ||
    (multipleImages && multipleImages.length === 0);

  const propertyCondition =
    !title ||
    !price ||
    !countries ||
    (allStates?.length > 0 && stateValue === "") ||
    (allCities?.length > 0 && cityValue === undefined) ||
    (cityValue === "undefined" && allCities?.length > 0) ||
    !parentId ||
    !subCategoriesId ||
    !description ||
    !areaInputValue ||
    !subChildCategoriesValue ||
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
      animationOut="fadeInDown"
      animationInTiming={500}
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
          <Text style={styles.title}>{t("Create Item For Sale")}</Text>
          <TouchableOpacity
            onPress={() => {
              onDismiss(false);
            }}
          >
            <Image source={IMAGES.crossIcon} style={styles.crossIcon} />
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView>
          <View
            style={{
              padding: 20,
            }}
          >
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
                value={price}
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
                  value={countryValue ? countryValue : ""}
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

            <View style={styles.categoriesPickerContainer}>
              <PickerComponent
                title={t("Category")}
                countries={parentCategoryData}
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
              {childCategoriesValue?.length > 0 &&
                subChildAllData === "item" && (
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
              {childCategoriesValue?.length > 0 &&
                subChildAllData === "vehicle" && (
                  <View style={[styles.pickerStyle, { top: 17 }]}>
                    <TextInput
                      placeholder={t("Make")}
                      placeholderTextColor={COLORS.grey}
                      value={makeInputValue}
                      onChangeText={(text) => setMakeInputValue(text)}
                      style={[styles.input]}
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
              {childCategoriesValue?.length > 0 &&
                subChildAllData === "property" && (
                  <View style={[styles.pickerStyle, { top: 17 }]}>
                    <TextInput
                      placeholder={t("Area")}
                      placeholderTextColor={COLORS.grey}
                      value={areaInputValue}
                      keyboardType="numeric"
                      onChangeText={(text) => setAreaInputValue(text)}
                      style={styles.input}
                    />
                  </View>
                )}

              {childCategoriesValue?.length > 0 &&
                subChildAllData === "vehicle" && (
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
              {childCategoriesValue?.length > 0 &&
                subChildAllData === "item" && (
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
              {childCategoriesValue?.length > 0 &&
                subChildAllData === "property" && (
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

              {childCategoriesValue?.length > 0 &&
                subChildAllData === "property" && (
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

              {subChildData?.length > 0 && subChildAllData === "vehicle" && (
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
                        renderItem={({ item }) =>
                          PostModalImgDocx(item, deleteItem, onPressImage)
                        }
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            disabled={condition}
            style={buttonStyle}
            onPressIn={() => {
              onPressPost();
            }}
          >
            <Text style={styles.textStyle}>{t("Post")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.darkGray }]}
            onPressIn={() => {
              onPressPost("Draft");
            }}
          >
            <Text style={styles.textStyle}>{t("Save In Draft")}</Text>
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
    justifyContent: "space-around",
    width: getWidth(98),
    marginTop: heightPercentageToDP(3),
    marginVertical: 20,
  },
  uploadBox: {
    height: getHeight(12),
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
  categoriesPickerContainer: {
    marginTop: Platform.OS === "ios" ? -10 : -5,
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
    width: getWidth(40),
    alignItems: "center",
    justifyContent: "center",
    height: getHeight(5),
  },
  disabledButton: {
    backgroundColor: "#6c757d",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    width: getWidth(40),
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
  dropdownElement: {
    marginTop: 10,
    height: 50,
    borderColor: COLORS.cocoGrey,
    borderWidth: 0.5,
    width: getWidth(87),
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

export default CreateItemComponent;
