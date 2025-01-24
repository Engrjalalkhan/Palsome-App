import { useTranslation } from "react-i18next";
import React, { useState, useCallback, useEffect } from "react";
import { Text, TouchableHighlight, TouchableOpacity } from "react-native";

import { franc } from "franc-min";
import Autolink from "react-native-autolink";
import Toast from "react-native-simple-toast";
import { useNavigation } from "@react-navigation/native";
import Clipboard from "@react-native-clipboard/clipboard";

import { COLORS } from "../../Constants/Colors";

const MyHofTxt = ({
  text,
  children,
  rtl,
  textStyle,
  paddingLeftTrue,
  stop,
}) => {
  const { t } = useTranslation();

  const [showw, setShoww] = useState(true);
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const [length, setLength] = useState();
  const [numLines, setNumLines] = useState(undefined);

  const toggleNumberOfLines = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback((e) => {
    // e.nativeEvent.lines.length == 4 ? setShoww(false) : setShoww(true);
    setLengthMore(e.nativeEvent.lines.length > 4);
    setLength(e.nativeEvent.lines.length);
    //to check the text is more than 4 lines or not
  }, []);

  const handleLongPress = () => {
    Clipboard.setString(text);
    Toast.show(t("Text copied"), Toast.LONG);
  };

  return (
    <>
      <TouchableHighlight
        activeOpacity={0.7}
        onLongPress={handleLongPress}
        underlayColor="rgba(0, 0, 0, 0.1)"
      >
        <Text
          onTextLayout={onTextLayout}
          numberOfLines={textShown ? undefined : 5}
          style={[
            textStyle,
            {
              lineHeight: rtl ? 30 : 22,
              textAlign: rtl ? "right" : "left",
              paddingLeft: paddingLeftTrue ? 0 : 9,
              alignSelf: rtl ? "flex-end" : "flex-start",
            },
          ]}
        >
          {children}
        </Text>
      </TouchableHighlight>

      {lengthMore ? (
        <Text
          onPress={toggleNumberOfLines}
          style={[
            {
              // lineHeight: 15,
              color: "#DF4B38",
              fontSize: 12,
              fontWeight: "bold",
              paddingLeft: 10,
              paddingLeft: paddingLeftTrue ? 0 : 9,
            },
            textStyle,
          ]}
        >
          {textShown ? t("Read less") : t("Read more")}
        </Text>
      ) : null}
    </>
  );
};

const NewsFeedText = ({
  txt,
  color = "black",
  textStyle,
  paddingLeftTrue,
  clipStop,
  stop,
}) => {
  const navigation = useNavigation();

  const [isRT, setIsRT] = useState(false);

  const isRTLang = (txt) => {
    const lang = franc(txt);
    return ["arb", "urd", "pes"].includes(lang);
  };

  useEffect(() => {
    isRTLang(txt) ? setIsRT(true) : setIsRT(false);
  }, [txt]);

  return txt ? (
    <MyHofTxt
      text={txt}
      rtl={isRT}
      paddingLeftTrue={paddingLeftTrue}
      stop={stop}
    >
      <Autolink
        text={txt}
        email={false}
        textProps={{ style: [{ color }, textStyle] }}
        stripPrefix={false}
        component={Text}
        onPress={(url, match) => {
          switch (match.getType()) {
            default:
              navigation.navigate("WebViewScreen", url);
          }
          {
            stop && clipStop();
          }
        }}
        linkProps={{ suppressHighlighting: true }}
        linkStyle={{ color: COLORS.primary }}
        matchers={[
          {
            pattern: /(^|\s)(#[a-z\d-]+)/gi,
            style: { color: "#3F729B", fontWeight: "bold" },
            getLinkText: (replacerArgs) => `${replacerArgs[0]}`,
            onPress: (match) => {
              navigation.navigate("Hashtag", {
                userId: match.getReplacerArgs()[2],
                stop: stop,
              });
              {
                stop && clipStop();
              }
            },
          },
          {
            pattern: /(^|\s)(@[a-z\d-]+)/gi,
            style: [{ color: COLORS.primary }],
            getLinkText: (replacerArgs) => `${replacerArgs[0]}`,
            onPress: (match) => {
              console.log(match.getReplacerArgs()[2]);
            },
          },
        ]}
      />
    </MyHofTxt>
  ) : null;
};

export default React.memo(NewsFeedText);
