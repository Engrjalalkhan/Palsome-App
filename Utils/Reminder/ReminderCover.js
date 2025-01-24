import { IMAGES } from "../../src/Constants/Images";
import { SITE_URL } from "../../src/Services/Constants";

export const getReminderCoverPicture = (item) => {
  return item?.reminder_cover_picture
    ? { uri: SITE_URL + item?.reminder_cover_picture }
    : IMAGES.blankCover;
};

export const getUserInitials = (item, reminders, userData) => {
  if (!reminders) {
    if (item?.reminder_owner) {
      return [
        item?.reminder_owner?.first_name.charAt(0),
        item?.reminder_owner?.last_name.charAt(0),
      ];
    }
    return ["", ""];
  }

  if (userData) {
    return [userData?.first_name.charAt(0), userData?.last_name.charAt(0)];
  }

  return ["", ""];
};
