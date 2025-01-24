import React, { Fragment, useState } from "react";
import { Dimensions, View, StyleSheet, Platform } from "react-native";

import StoryCircleListView from "./StoryCircleListView";

import StoryModel from "./components/StoryModel";

const { height, width } = Dimensions.get("window");

export const Story = ({ data, duration }) => {
  const [selectedData, setSelectedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const _handleStoryItemPress = (item, index) => {
    const newData = data.slice(index);

    setSelectedData(newData);
    setIsModalOpen(true);
  };

  return (
    <Fragment>
      <View
        style={{
          alignItems: Platform.OS == "android" ? "flex-start" : null,
        }}
      >
        <StoryCircleListView
          handleStoryItemPress={_handleStoryItemPress}
          data={data}
        />
      </View>
      <StoryModel
        isOpen={isModalOpen}
        data={selectedData}
        duration={duration}
        setIsModalOpen={setIsModalOpen}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    height,
    width,
  },
});

export default React.memo(Story);

Story.defaultProps = {
  showAvatarText: true,
};
