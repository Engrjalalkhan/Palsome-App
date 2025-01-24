import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { settingsApiCall } from "./Apis";
import { setStories } from "../Redux/actions/NewsFeedActions";

export const loadStories = async () => {
  const dispatch = useDispatch();
  console.log("aliiiiiiiiiiiii");
  try {
    const res = await settingsApiCall({
      route: "story",
      verb: "GET",
      token: token,
    });
    if (res.responseCode !== 200) {
      console.log("res !== 200 in fetch Stories ===>junaid", res);
    } else if (res.responseCode == 200) {
      console.log("res in fetch storyesssss  ===>junaid", res.payload.data);
      dispatch(setStories(res.payload.data.stories));
    }
  } catch (error) {
    console.log("saga login error -- ", error.toString());
  }
};
