import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { HP, WP } from "../../../../Utils/Resposive";
import LogoutModal from "../../../Components/LogoutModal";
import MyHeader from "../../../Components/MyHeader";
import { ACTIONS } from "../../../Redux/action-types";
import { settingsApiCall } from "../../../Services/Apis";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { COLORS } from "../../../Constants/Colors";

const LoggedInDevices = (props) => {
  const token = useSelector((state) => state.auth.userToken);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [discardModalVisible, setDiscardModalVisible] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const logoutFromThisDevice = () => {
    dispatch({ type: ACTIONS.LOGOUT });
  };
  const getDevices = async () => {
    setLoading(true);
    try {
      const res = await settingsApiCall({
        route: "logged-in-devices",
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        // console.log("res !== 200 in fetchStates ... ", res);
        setLoading(false);
      } else if (res.responseCode == 200) {
        // console.log("res from saga", res?.payload?.data);
        setDevices(res?.payload?.data?.devices);
        setLoading(false);
      }
    } catch (e) {
      console.log("saga login error -- ", e.toString());
      setLoading(false);
    }
  };
  const LogoutFromAllDevices = async () => {
    setLogoutLoading(true);
    setDiscardModalVisible(false);
    try {
      const res = await settingsApiCall({
        route: "logout/all/along-me",
        verb: "GET",
        token: token,
      });

      if (res.responseCode !== 200) {
        // console.log("res !== 200 in  ... ", res);
        setLogoutLoading(false);
      } else if (res.responseCode == 200) {
        // console.log("res from saga", res);

        setLogoutLoading(false);
        logoutFromThisDevice();
      }
    } catch (e) {
      console.log("saga login error -- ", e.toString());
    }
  };
  useEffect(() => {
    getDevices();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <MyHeader
        goBack={props.navigation.goBack}
        heading={t("Logged In Devices")}
      />
      <FlatList
        data={devices ? devices : []}
        style={styles.list}
        ListEmptyComponent={
          <>
            <ActivityIndicator
              animating={loading}
              style={styles.loader}
              size="large"
              color={COLORS.primary}
            />
          </>
        }
        ListHeaderComponent={
          <>
            {logoutLoading ? (
              <ActivityIndicator
                animating={logoutLoading}
                style={styles.logoutLoader}
                size="large"
                color={COLORS.primary}
              />
            ) : (
              <>
                {devices.length ? (
                  <TouchableOpacity
                    style={styles.footerBox}
                    onPress={() => setDiscardModalVisible(true)}
                  >
                    <Text style={styles.footerTxt}>
                      {t("Logout from all devices")}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </>
            )}
          </>
        }
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.item}>
              {/* {console.log(item.device)} */}
              {item?.device ? (
                <FontAwesome5 name={item?.device} size={WP(5)} />
              ) : null}
              <View style={{ marginLeft: WP(5) }}>
                {item?.browser ? (
                  <Text style={styles.staTxt}>{item?.browser}</Text>
                ) : null}

                <Text style={styles.staTxt}>{item?.last_activity}</Text>
                <Text style={styles.locTxt}>{item?.address}</Text>
                <Text style={styles.ipTxt}>{item?.ip_address}</Text>
              </View>
            </View>
          );
        }}
      />
      {discardModalVisible && (
        <LogoutModal
          isVisible={discardModalVisible}
          setIsVisible={setDiscardModalVisible}
          onDiscard={LogoutFromAllDevices}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  list: { backgroundColor: COLORS.tooLightGrey, paddingTop: HP(1) },
  item: {
    backgroundColor: COLORS.white,
    flexDirection: "row",

    alignItems: "center",
    marginHorizontal: WP(3),
    paddingHorizontal: WP(4),
    paddingVertical: HP(1),
    marginBottom: HP(1),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  browTxt: { fontWeight: "bold", fontSize: WP(4.5) },
  staTxt: { fontSize: WP(3) },
  locTxt: { fontSize: WP(2.8) },
  ipTxt: { fontSize: WP(2.8) },
  footerBox: {
    height: HP(6),
    backgroundColor: COLORS.redicalRed,
    marginHorizontal: WP(3),
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: HP(1),
  },
  footerTxt: {
    fontWeight: "bold",
    color: COLORS.white,
    fontSize: HP(2.2),
  },
  logoutLoader: { marginVertical: HP(2) },
});
export default LoggedInDevices;
