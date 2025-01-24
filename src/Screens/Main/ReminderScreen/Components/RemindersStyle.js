import { COLORS } from "../../../../Constants/Colors";

const textBottomTopContainerStyle = (position) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  paddingHorizontal: 15,
  position: "absolute",
  [position]: 0,
  width: "100%",
  height: 100,
  backgroundColor: position === "bottom" ? COLORS.primary : "transparent",
  paddingVertical: 5,
});

const textBottomTopStyle = (position) => ({
  backgroundColor: position === "top" ? COLORS.white : "green",
  padding: 10,
  borderRadius: 17,
});

const textBottomTopContainerSavedStyle = (position) => ({
  flexDirection: position === "top" ? "row" : "column",
  justifyContent: position === "top" ? "space-between" : "center",
  alignItems: "flex-start",
  paddingHorizontal: 15,
  position: "absolute",
  bottom: position == "bottom" ? 0 : 50,
  width: "100%",
  height: 50,
  backgroundColor: position === "bottom" ? COLORS.white : COLORS.primary,
  paddingVertical: 5,
});

export {
  textBottomTopContainerStyle,
  textBottomTopStyle,
  textBottomTopContainerSavedStyle,
};
