export const getRepeatData = (t) => [
  { label: t("Never"), value: t("Never") },
  { label: t("Daily"), value: t("Daily") },
  { label: t("Weekly"), value: t("Weekly") },
  { label: t("Fortnightly"), value: t("Fortnightly") },
  { label: t("Every 3 months"), value: t("Every 3 months") },
  { label: t("Every 6 months"), value: t("Every 6 months") },
  { label: t("Yearly"), value: t("Yearly") },
];
export const getStatusData = (t) => [
  {
    label: t("Completed"),
    value: "1",
  },
  {
    label: t("Incomplete"),
    value: "0",
  },
];

export const getExpiryData = (t) => [
  { label: t("1 Month"), value: t("1") },
  { label: t("3 Months"), value: t("3") },
  { label: t("6 Months"), value: t("6") },
  { label: t("9 Months"), value: t("9") },
  { label: t("1 Year"), value: t("year") },
  { label: t("Custom"), value: t("custom") },
  { label: t("Museum"), value: t("museum") },
];
