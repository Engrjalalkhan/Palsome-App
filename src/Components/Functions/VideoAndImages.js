import React, { useCallback } from "react";
import { imgRegex, videoRegex } from "../../../Utils/Regexes/imgVideoRegex";

export const VideoAndImages = (arr) => {
  let videoBool = false;
  let imageBool = false;

  arr?.map((itm, ind) => {
    console.log("arr", itm.type);
    if (itm.type.match(imgRegex)) {
      imageBool = true;
    }
    if (itm.type.match(videoRegex)) {
      videoBool = true;
    }
  });
  if (videoBool && !imageBool) {
    return "videoBool";
  } else if (imageBool && !videoBool) {
    return "imageBool";
  } else if (videoBool && imageBool) {
    return "Both";
  }
};

export const VidsImgs = (arr) => {
  let videoBool = [];
  let imageBool = [];

  let counter_image = 0;
  let counter_video = 0;

  arr?.map((itm, ind) => {
    if (itm.path.match(imgRegex)) {
      imageBool[counter_image] = itm.path;
      counter_image++;
    }
    if (itm.path.match(videoRegex)) {
      videoBool[counter_video] = {
        videoUri: itm.stream_path,
        thumbUri: itm.thumb_path,
      };
      counter_video++;
    }
  });

  if (videoBool.length && !imageBool.length) {
    const videos = { video: videoBool, type: "video" };
    return videos;
  } else if (imageBool.length && !videoBool.length) {
    return { image: imageBool, type: "image" };
  } else if (videoBool.length && imageBool.length) {
    return { video: videoBool, image: imageBool, type: "both" };
  }
};
