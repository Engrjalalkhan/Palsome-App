import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getWidth } from "../../../../../Utils/NewResponsive";
import { IMAGES } from "../../../../Constants/Images";
import { Image } from "react-native";
import { COLORS } from "../../../../Constants/Colors";
import { useTranslation } from "react-i18next";

const SaveItemModal = ({
  modalVisible,
  setModalVisible,
  onPressCreateCollection,
  onPressUpdate,
  selectedPost,
  edit,
  collectionName,
  setCollectionName,
  errorMessage,
  setErrorMessage,
  createCollectionLoading,
}) => {
  const { t } = useTranslation();

  const trimmedCollectionName = collectionName.trim();
  const disabledCondition =
    trimmedCollectionName.length < 3 || errorMessage?.length > 0;

  const handleCreateCollection = () => {
    onPressCreateCollection(trimmedCollectionName);
  };
  const handleCloseModal = () => {
    setModalVisible(!modalVisible);
    setCollectionName("");
    setErrorMessage("");
  };

  useEffect(() => {
    if (edit) {
      setCollectionName(selectedPost?.title);
    }
  }, [selectedPost]);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.mainContainer}>
              <Text>
                {edit ? t("Edit Collection") : t("Create Collection")}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Image source={IMAGES.crossIcon} style={styles.crossIcon} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={(value) => {
                setCollectionName(value);
                if (errorMessage) setErrorMessage("");
              }}
              value={collectionName}
              placeholder={t("Give your collection a name")}
              placeholderTextColor={COLORS.grey}
            />

            <View style={styles.error}>
              {errorMessage?.length > 0 && (
                <Text style={styles.errorText}>{t(errorMessage)}</Text>
              )}
              {trimmedCollectionName?.length > 0 &&
                trimmedCollectionName?.length < 3 && (
                  <Text style={styles.errorText}>
                    {t("The title must be at least 3 characters.")}
                  </Text>
                )}
            </View>
            <Pressable
              disabled={disabledCondition}
              style={[
                styles.button,
                styles.buttonClose,
                {
                  backgroundColor: disabledCondition
                    ? COLORS.grey
                    : COLORS.primary,
                },
              ]}
              onPress={edit ? onPressUpdate : handleCreateCollection}
            >
              {createCollectionLoading ? (
                <ActivityIndicator size={"small"} color={COLORS.white} />
              ) : (
                <Text style={styles.textStyle}>
                  {edit ? t("Update") : t("Create")}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SaveItemModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  mainContainer: {
    position: "absolute",
    top: 0,
    backgroundColor: "white",
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 15,
    width: getWidth(90),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 50,
    paddingBottom: 30,
    width: getWidth(90),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 7,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    width: getWidth(80),
  },

  buttonClose: {
    backgroundColor: COLORS.primary,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  crossIcon: { width: 25, height: 25, resizeMode: "contain" },
  input: {
    height: 100,
    width: getWidth(80),
    marginTop: 22,
    borderWidth: 1,
    padding: 10,
    paddingTop: 10,
    borderRadius: 10,
  },
  error: {
    width: getWidth(90),
    paddingHorizontal: 20,
    marginVertical: 5,
    height: 20,
  },
  errorText: {
    color: COLORS.primary,
    lineHeight: 20,
  },
});
