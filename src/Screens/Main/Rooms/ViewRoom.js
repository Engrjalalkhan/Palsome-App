import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

import RoomsTL from "./components/RoomsTL";
import {
  clearRoomData,
  showRoomRequest,
} from "../../../Redux/actions/RoomActions";

const ViewRoom = ({ route }) => {
  const fromSplash = route?.params?.fromSplash;

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.userToken);
  const viewRoomData = useSelector((state) => state.roomsRed.showRoomDeatils);
  const createPostLoading = useSelector(
    (state) => state?.blackNewsF?.createPostLoading
  );
  const deletePostLoading = useSelector(
    (state) => state?.blackNewsF?.deletePostLoading
  );
  const editPostLoading = useSelector(
    (state) => state?.blackNewsF?.editPostLoading
  );
  const [loading, setLoading] = useState(false);
  const [PaginationData, setPaginationData] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [current_page, setCurrentPage] = useState(1);

  const id = route?.params?.id;
  const alert = route?.params?.alert;

  useEffect(() => {
    dispatch(
      showRoomRequest({
        token: token,
        id: id,
        setLoading: setLoading,
        setPaginationData: setPaginationData,
        page: current_page,
      })
    );

    //clear on exit
    return () => {
      dispatch(clearRoomData());
    };
  }, [current_page]);

  return (
    <SafeAreaView style={styles.container}>
      <RoomsTL id={id} alert={alert} fromSplash={fromSplash} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ViewRoom;
