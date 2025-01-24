import React, { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { Text } from "react-native-paper";
import Header from "../../../Components/Header";
import Button from "../../../Components/Button";
import TextInput from "../../../Components/TextInput";
import BackButton from "../../../Components/BackButton";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import styles from "./styles";
import { useDispatch, useSelector } from "react-redux";

import { createGroup } from "../../../Redux/actions/ProfileActions";

const CreateGroup = ({ navigation }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);

  const [groupName, setGroupName] = useState("");
  const [groupNameError, setGroupNameError] = useState(false);
  const [groupNameErrorTxt, setGroupNameErrorTxt] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [description, setDescription] = useState("");

  const CreateGroupFunction = async () => {
    if (groupName) {
      setGroupNameError(false);
      let formData = new FormData();
      formData.append("name", groupName);
      formData.append("privacy", privacy);
      formData.append("description", description);
      dispatch(createGroup({ formData, token }));
    } else {
      if (!groupName) {
        setGroupNameError(true);
        setGroupNameErrorTxt("Group Name is Required");
      } else {
        setGroupNameError(false);
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <BackButton goBack={navigation.goBack} />
      <SafeAreaView style={styles.textmain}>
        <Header>Groups</Header>
        <Text style={styles.text}>Create your own Group</Text>
        <View style={styles.textsub}>
          <TextInput
            label="Grpoup Name"
            returnKeyType="done"
            value={groupName}
            onChangeText={setGroupName}
          />
          {groupNameError ? (
            <View>
              <Text style={styles.error}>{groupNameErrorTxt}</Text>
            </View>
          ) : null}

          {/* {Platform.OS == "android" ? (
            <View style={styles.pickerView}>
              <Picker
                mode="dropdown"
                style={{ color: "#000" }}
                itemStyle={styles.picker}
                // dropdownIconColor=COLOrs.primary
                selectedValue={privacy}
                onValueChange={(itemValue, itemIndex) => setPrivacy(itemValue)}
              >
                <Picker.Item label="Public" value="public" color="black" />

                <Picker.Item label="Private" value="private" color="black" />
              </Picker>
              <Text
                style={{
                  width: "100%",

                  position: "absolute",
                  bottom: 5,
                  left: 0,
                }}
              >
                {" "}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.iosPicker}
              onPress={() => setMyVisiblePrivacy(true)}
            >
              <Text> {privacy(privacyPickerValue)} </Text>
              <Icon name="chevron-circle-down" color="orange" />
              <CustomPicker
                visible={myVisiblePrivacy}
                selectedValue={privacyPickerValue}
                setValueFunc={(val) => setPrivacyPicker(val)}
                data={privacyData}
                hideVisible={() => setMyVisiblePrivacy(false)}
              />
            </TouchableOpacity>
          )} */}

          <TextInput
            label="Description"
            returnKeyType="done"
            multiline={true}
            numberOfLines={3}
            value={description}
            onChangeText={(val) => setDescription(val)}
          />
        </View>

        <View style={styles.textsub}>
          <Button
            mode="contained"
            onPress={() => CreateGroupFunction({ groupName })}
          >
            Create Group
          </Button>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default CreateGroup;
