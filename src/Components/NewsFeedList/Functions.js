import React from "react";
import { View } from "react-native";
import { HP } from "../../../Utils/Resposive";
import { COLORS } from "../../Constants/Colors";

export let isModalVisible = false;
export const result = [
  {
    id: "1",
    Members: "2 Members",
  },
  {
    id: "2",
    Members: "3 Memebers",
  },
  {
    id: "3",
    Members: "2 Members",
  },
  {
    id: "4",
    Members: "3 Memebers",
  },
  {
    id: "5",
    Members: "2 Members",
  },
  {
    id: "6",
    Members: "3 Memebers",
  },
  {
    id: "7",
    Members: "2 Members",
  },
  {
    id: "8",
    Members: "3 Memebers",
  },
];

export const handleLike = () => {
  console.log("liked");
};
export const handleComments = () => {
  toggleModal();
};
export const handleShare = () => {
  console.log("shared");
};
const toggleModal = () => {
  console.log("its called");
};

export const FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: HP(1),
        width: "100%",
        backgroundColor: COLORS.tooLightGrey,
      }}
    />
  );
};

function formatDate(date, showYear) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;

  var month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][date.getMonth()];
  return (
    date.getDate() +
    " " +
    month +
    (showYear ? " " + date.getFullYear() : "") +
    (showYear ? " at " : " at ") +
    strTime
  );
}

export const timeDifference = (previous) => {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;
  const mydate = new Date(previous);
  var elapsed = new Date() - mydate;

  if (elapsed < msPerMinute) {
    return "Just Now";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + "m";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + "h";
  } else if (elapsed < msPerMonth) {
    // return +Math.round(elapsed / msPerDay) + " d";
    return formatDate(mydate);
  } else if (elapsed < msPerYear) {
    // return +Math.round(elapsed / msPerMonth) + " month";
    return formatDate(mydate);
  } else {
    // return +Math.round(elapsed / msPerYear) + " y";
    return formatDate(mydate, true);
  }
};

export const timeDifferenceComments = (previous) => {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;
  const mydate = new Date(previous);
  var elapsed = new Date() - mydate;

  if (elapsed < msPerMinute) {
    return "Just Now";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + "m";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + "h";
  } else if (elapsed < msPerMonth) {
    return +Math.round(elapsed / msPerDay) + "d";
  } else if (elapsed < msPerYear) {
    return +Math.round(elapsed / msPerMonth) + " month";
  } else {
    return +Math.round(elapsed / msPerYear) + " y";
  }
};
export const timeDifferenceAlbums = (previous) => {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;
  const mydate = new Date(previous);
  var elapsed = new Date() - mydate;

  if (elapsed < msPerMinute) {
    return "Just Now";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + "m ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + "h ago";
  } else if (elapsed < msPerMonth) {
    return +Math.round(elapsed / msPerDay) + "d ago";
  } else if (elapsed < msPerYear) {
    return +Math.round(elapsed / msPerMonth) + " month ago";
  } else {
    return +Math.round(elapsed / msPerYear) + " y ago";
  }
};
