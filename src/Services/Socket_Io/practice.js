import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Echo from "laravel-echo";
import { setSideBarFriendList } from "../../Redux/actions/NewsFeedActions";
import { useDispatch, useSelector } from "react-redux";

const Practice = ({ handlePractice }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.auth?.userToken);
  const id = useSelector((state) => state?.auth?.userData?.id);
  const Side_friend = useSelector((state) => state?.newsF?.sideBarFriendList);

  useEffect(() => {
    window.io = require("socket.io-client");

    window.Echo = new Echo({
      broadcaster: "socket.io",
      host: "https://www.palsome.com:6001", // this is laravel-echo-server host
      auth: {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer" + token,
        },
      },
    });

    window.Echo.private(`users.${id}.sidebar.friends`).listen(
      ".update.sidebar.friends",
      (e) => {
        console.log("Received update:", e);
        dispatch(setSideBarFriendList(e.sidebarFriends));
        console.log("Sidebar Friends:", e.sidebarFriends);
      }
    );

    return () => {
      window.Echo.disconnect();
    };
  }, []);

  return <View></View>;
};

export default Practice;
