import React from "react";
import { useSelector } from "react-redux";

import InstaStory from "./InstaStory";

const Stories = () => {
  const storyData = useSelector((state) => state.newsF.stories);
  const myStoriesForIndex = useSelector((state) => state.newsF.myStories);

  const updatedStoryData = [...storyData];

  updatedStoryData.sort((a, b) => {
    if (a.seen && !b.seen) {
      return 1;
    } else if (!a.seen && b.seen) {
      return -1;
    } else {
      return 0;
    }
  });

  return <InstaStory data={updatedStoryData} duration={10} />;
};

export default React.memo(Stories);
