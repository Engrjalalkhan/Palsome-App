import React, { useState } from "react";
import { ScrollView, Text } from "react-native";
import { COLORS } from "../../Constants/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const MaxScrollViewHeight = hp(14);

const ReadMore = ({ text, textstyle, handleText, readMore }) => {
  const [showFullText, setShowFullText] = useState(false);

  const MAX_LENGTH = 100;
  const toggleText = () => {
    setShowFullText(!showFullText), handleText();
  };

  const truncatedText =
    text.length > MAX_LENGTH ? text.substring(0, MAX_LENGTH) + "..." : text;

  return (
    <Text onPress={toggleText} style={textstyle}>
      {readMore ? text : truncatedText}
      {text.length > MAX_LENGTH && (
        <Text style={{ fontWeight: "bold", color: COLORS.primary }}>
          {" "}
          {readMore ? "Read less" : "Read more"}
        </Text>
      )}
    </Text>
  );
};

export default ReadMore;
