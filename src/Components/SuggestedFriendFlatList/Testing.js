import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Item from "./Itemll";

const Testing = (props) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          // display: isSh == true ? "flex" : "none",
          flexDirection: "column",
          // borderWidth: 0.3,
          borderRadius: 10,
          margin: 5,
          backgroundColor: "white",
          height: HP(28),

          // shadowColor: "green",
          /////////////////
          shadowColor: "#171717",
          elevation: 20,

          shadowOffset: { width: -4, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          ////////////////////
          // padding: 5,
        }}
      >
        {/* <Text style={{ paddingLeft: 10, paddingTop: 5, paddingBottom: 5 }}>
            Suggested Friends
          </Text> */}

        <View style={styles.itemContainer}>
          <FastImage source={{ uri: item.covimg }} style={styles.itemCovPic}>
            <TouchableOpacity
              style={styles.crossIconWraps}
              onPress={() => {
                deleteSuggestedFriend(item.id);
              }}
            >
              {item?.cover_picture != null ? (
                <ImageBackground
                  source={
                    item?.cover_picture != null
                      ? { uri: SITE_URL + item?.cover_picture }
                      : null
                  }
                  resizeMode="stretch"
                  style={{
                    height: 85,
                    width: WP(60),
                    justifyContent: "center",
                    alignItems: "center",
                    // marginLeft: -HP(7),
                  }}
                >
                  <View style={styles.crossIconWraps}>
                    <Icon name="times" color={"white"} size={HP(3)} />
                  </View>
                </ImageBackground>
              ) : null}
              <Icon name="times" color={"white"} size={HP(3)} />
            </TouchableOpacity>
          </FastImage>
          <Pressable
            onPress={() => {
              navigate.navigate("ProfileScreen", { userName: item.name });
              console.log(item.id);
            }}
            style={styles.ItemProfPicBox}
          >
            <FastImage
              source={
                item?.profile_picture != null
                  ? {
                      uri: SITE_URL + item?.profile_picture,
                    }
                  : require("../../Assets/images/blankDP.jpg")
              }
              style={styles.dpStyle}
            />

            <Text style={styles.itemTxt} numberOfLines={2}>
              {item.first_name + " " + item.last_name}
            </Text>
          </Pressable>

          <View
            style={{
              alignItems: "center",
              flex: 1,

              marginTop: "5%",
            }}
          >
            {item?.friendship_status == "request" ? (
              <Button
                text={"request"}
                icon={"checkmark-outline"}
                buttonstyle={styles.btn}
                textstyle={styles.btnText}
                iconStyle={styles.iconStyle}
                pressFunction={handleRemoveFriend}
              />
            ) : item?.friendship_staus == "received" ? (
              <Button
                text={"Respond"}
                icon={"person-add-sharp"}
                buttonstyle={styles.btn}
                textstyle={styles.btnText}
                iconStyle={styles.iconStyle}
                pressFunction={handleRespondRequest}
              />
            ) : item?.friendship_staus == "cancel" ? (
              <Button
                text={count == false ? "Cancel Request" : addFriendStats}
                icon={count == false ? "arrow-forward" : "person-add-sharp"}
                buttonstyle={styles.btn}
                textstyle={styles.btnText}
                iconStyle={styles.iconStyle}
                pressFunction={() => {
                  // handleOnPressFriendRequest({
                  //   do: "friend-cancel",
                  // });
                  if (item?.friendship_staus == "cancel") {
                    setCount(true);
                  }
                  // setCount(true);
                  userRelations(item.id);
                }}
              />
            ) : item.friendship_staus == "add" ? (
              <Button
                text={addFriendStats == "" ? "Add Friend" : addFriendStats}
                icon={
                  addFriendStats == "" || addFriendStats == "Add Friend"
                    ? "person-add-sharp"
                    : "checkmark-outline"
                }
                buttonstyle={styles.btn}
                textstyle={styles.btnText}
                iconStyle={styles.iconStyle}
                pressFunction={() => {
                  // handleOnPressFriendRequest({
                  //   do: "friend-add",
                  // });
                  userRelations(item.id);
                }}
              />
            ) : null}
          </View>

          <ScrollView horizontal={true}>
            {data?.map((item, index) => {
              return (
                <>
                  <Item
                    setData={setData}
                    item={item}
                    index={index}
                    onPressCross={onPressCross}
                    data={data}
                  />

                  {index == data.length - 1 ? (
                    //dataObject.data.length  (
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 10,
                      }}
                      onPress={() => {
                        navigate.navigate("FriendReq", {
                          title: "Suggestions",
                        });
                      }}
                    >
                      <IconArrow name="arrowright" size={20} color={"red"} />
                      <Text
                        style={{
                          color: "red",
                          justifyContent: "center",
                          fontWeight: "bold",
                          alignItems: "center",
                          // borderWidth: 1,
                        }}
                      >
                        See All
                      </Text>
                    </Pressable>
                  ) : null}
                </>
              );
            })}
          </ScrollView>
          {/* ////////////////////////// */}
          <FlatList
            // data={dataObject?.data}
            data={data}
            horizontal
            // vertical
            contentContainerStyle={styles.contentContainerStyle}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <>
                <Item
                  setData={setData}
                  item={item}
                  index={index}
                  onPressCross={onPressCross}
                  data={data}
                />

                {index == data.length - 1 ? (
                  //dataObject.data.length  (
                  <Pressable
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      margin: 10,
                    }}
                    onPress={() => {
                      navigate.navigate("FriendReq", { title: "Suggestions" });
                    }}
                  >
                    <IconArrow name="arrowright" size={20} color={"red"} />
                    <Text
                      style={{
                        color: "red",
                        justifyContent: "center",
                        fontWeight: "bold",
                        alignItems: "center",
                        // borderWidth: 1,
                      }}
                    >
                      See All
                    </Text>
                  </Pressable>
                ) : null}
              </>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
});
export default Testing;
