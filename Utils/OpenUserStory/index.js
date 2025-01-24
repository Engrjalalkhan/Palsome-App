import { StoryDataSorting } from "../StoryDataSorting";

export const getOpenUserStory = (
  user_id,
  userData,
  my_storyData,
  storyData,
  setCurrentUserStories,
  setIsModalOpen,
  navigation
) => {
  if (userData?.id === user_id) {
    if (my_storyData?.length) {
      navigation.navigate("myStory", {
        myStoryData: my_storyData,
        index: 0,
      });
    } else {
      navigation.push("ProfileScreen", {
        id: user_id,
      });
    }
  } else {
    const currentUserStory = StoryDataSorting(storyData, user_id);
    const userStories = currentUserStory.filter(
      (story) => story?.user_id === user_id
    );

    if (userStories.length > 0) {
      setCurrentUserStories(currentUserStory);
      setIsModalOpen(true);
    } else {
      navigation.push("ProfileScreen", {
        id: user_id,
      });
    }
  }
};
