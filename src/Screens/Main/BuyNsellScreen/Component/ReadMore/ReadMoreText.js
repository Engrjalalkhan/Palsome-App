import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { getFontSize } from "../../../../../../Utils/NewResponsive";

const ReadMoreText = ({ text }) => {
  const { t } = useTranslation();
  const [showFullText, setShowFullText] = useState(false);

  const maxLines = 3;

  const toggleTextVisibility = () => {
    setShowFullText(!showFullText);
  };

  return (
    <View>
      <Text
        numberOfLines={showFullText ? undefined : maxLines}
        ellipsizeMode="tail"
        style={styles.text}
      >
        {text}
      </Text>

      {text?.length > maxLines * 20 && (
        <Text
          onPress={toggleTextVisibility}
          style={{ color: "red", fontWeight: "bold" }}
        >
          {showFullText ? t("Read Less") : t("Read More")}
        </Text>
      )}
    </View>
  );
};

export default ReadMoreText;

const styles = StyleSheet.create({
  text: {
    fontSize: getFontSize(1.8),
  },
});
