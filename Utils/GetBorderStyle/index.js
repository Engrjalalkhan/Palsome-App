import { COLORS } from "../../src/Constants/Colors";

export const getBorderStyle = (
  userData,
  user,
  my_storyData,
  mySeen,
  userHasStory,
  storyData
) => {
  const isCurrentUser = userData?.id === user?.id;
  const hasStory = isCurrentUser
    ? my_storyData?.length > 0 || mySeen
    : userHasStory;
  const storySeen = isCurrentUser
    ? mySeen
    : storyData?.some((story) => story?.user_id === user?.id && story?.seen);

  return {
    borderWidth: hasStory ? 3 : 0,
    borderColor: storySeen ? COLORS.grey : COLORS.primary,
  };
};
