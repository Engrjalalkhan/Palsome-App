import { COLORS } from "../../src/Constants/Colors";
import { ICONS } from "../../src/Constants/Icons";

export const actions = [
  {
    label: "Ascending",
    icon: ICONS.materialCommunityIcons("sort-ascending", COLORS.primary, 24),
    value: "asc",
  },
  {
    label: "Descending",
    icon: ICONS.materialCommunityIcons("sort-descending", COLORS.primary, 24),
    value: "desc",
  },
];
