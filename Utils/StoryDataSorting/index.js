export const StoryDataSorting = (data, currentUser) => {
  const userStories = data.filter((item) => item.user_id === currentUser);
  return userStories;
};
