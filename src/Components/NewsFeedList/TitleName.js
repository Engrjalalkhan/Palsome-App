import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../../Constants/Colors";
import { ICONS } from "../../Constants/Icons";
import SimpleToast from "react-native-simple-toast";

const TitleName = ({
  item,
  user,
  pages,
  groups,
  events,
  rooms,
  shared_page_post,
  promote_page,
  color = COLORS.transparent,
  ignoreLastName = false,
  style,
  onPressName,
}) => {
  const navigation = useNavigation();
  
  const sharedPost = item?.post_shared == null;

  const MAX_LENGTH = 9;
  // const toggleText = () => {
  //   setShowFullText(!showFullText), handleText();
  // };

  const truncatedText =
    rooms?.name.length > MAX_LENGTH
      ? rooms?.name.substring(0, MAX_LENGTH) + "..."
      : rooms?.name;

  return pages ? (
    <Text
      // onPress={() =>
      //   navigation.navigate("ProfileScreen", {
      //     userName: item3?.user?.name,
      //   })
      // }
      onPress={() => {
        SimpleToast.show("To view pages, check the website.");
      }}
      style={[styles.name, { color: color, ...style }]}
    >
      {pages?.page_name}
      {pages?.page_verified == "1" ? (
        <>
          {" "}
          <FontAwesome name="check-circle" color={COLORS.skyBlue} size={15} />
        </>
      ) : null}
    </Text>
  ) : groups ? (
    <Text
      onPress={() =>
        navigation.navigate("ProfileScreen", {
          id: user?.id,
        })
      }
      style={[styles.name, { color: color, ...style }]}
    >
      {user?.first_name} {user.last_name}
      {sharedPost && " in group"}
      {ICONS.antDesign("caretright")}
      <Text
        onPress={() => {
          navigation.push("Groups", {
            screen: "GroupsTL",
            params: { id: groups?.encrypted_id },
          });
        }}
      >
        {" "}
        {groups?.name}
      </Text>
    </Text>
  ) : rooms ? (
    <Text
      onPress={() =>
        navigation.navigate("ProfileScreen", {
          id: user?.id,
        })
      }
      style={[styles.name, { color: color, ...style }]}
    >
      {user?.first_name} {user.last_name}
      {sharedPost && " in room"}
      {ICONS.antDesign("caretright")}
      <Text
        onPress={() =>
          navigation.navigate("ViewRoom", {
            id: rooms?.encrypted_id,
            alert: true,
          })
        }
      >
        {" "}
        {rooms?.name}
      </Text>
    </Text>
  ) : events ? (
    <Text
      onPress={() =>
        navigation.navigate("ProfileScreen", {
          id: user?.id,
        })
      }
      style={[styles.name, { color: color, ...style }]}
    >
      {user?.first_name} {user.last_name}
      {sharedPost && " in event"}
      {ICONS.antDesign("caretright")}
      <Text
        onPress={() =>
          navigation.navigate("Events", {
            screen: "EventTL",
            params: { id: events?.encrypted_id },
          })
        }
      >
        {" "}
        {events?.event_name}
      </Text>
    </Text>
  ) : shared_page_post ? (
    <Text
      // onPress={() =>
      //   navigation.navigate("ProfileScreen", {
      //     userName: user?.name,
      //   })
      // }
      onPress={() => {
        SimpleToast.show("To view pages, check the website.");
      }}
      style={[styles.name, { color: color, ...style }]}
    >
      {item?.post_type == "ad_post" ?(
        shared_page_post?.page_name
      ):(
        shared_page_post?.[0]?.page_name
          ? shared_page_post?.[0]?.page_name
          : promote_page?.page?.page_name

      )}

      {shared_page_post?.page_verified == "1" ? (
        <>
          {" "}
          <FontAwesome name="check-circle" color={COLORS.skyBlue} size={15} />
        </>
      ) : item?.post_shared?.post_type === "post" ? (
        <Text>
          {item?.post_shared?.user?.first_name}{" "}
          {item?.post_shared?.user?.last_name}
        </Text>
      ) : null}
    </Text>
  ) : shared_page_post && promote_page ? (
    <Text
      // onPress={() =>
      //   navigation.navigate("ProfileScreen", {
      //     userName: user?.name,
      //   })
      // }
      style={[styles.name, { color: color, ...style }]}
    >
      {promote_page?.page?.page_name}

      {shared_page_post?.page_verified == "1" ? (
        <>
          {" "}
          <FontAwesome name="check-circle" color={COLORS.skyBlue} size={15} />
        </>
      ) : null}
    </Text>
  ) : (
    <Text
      onPress={() => {
        onPressName ? onPressName() : null;
        navigation.push("ProfileScreen", {
          id: user?.id,
        });
      }}
      style={[styles.name, { color: color, ...style }]}
    >
      {user?.first_name}
      {ignoreLastName ? null : " " + user?.last_name}
    </Text>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 16,
    color: COLORS.transparent,
    marginLeft: 10,
    fontWeight: "bold",
  },
});
export default React.memo(TitleName);
