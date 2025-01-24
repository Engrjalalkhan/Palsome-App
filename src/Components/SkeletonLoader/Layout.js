import { getWidth } from "../../../Utils/NewResponsive";

export const getLayout = (layoutType) => {
  switch (layoutType) {
    case "feed":
      return [
        {
          width: 80,
          height: 80,
          borderRadius: 125,
          marginBottom: 16,
          margin: 10,
        },
        {
          position: "absolute",
          bottom: 0,
          top: 30,
          left: 100,
          children: [
            {
              width: getWidth(50),
              height: 42,
              borderRadius: 16,
            },
          ],
        },
        {
          position: "absolute",
          bottom: 30,
          top: 100,
          left: 10,
          children: [
            {
              width: getWidth(95),
              height: 150,
              borderRadius: 16,
            },
          ],
        },
      ];
    case "room":
      return [
        // Define layout for type 2
      ];
    // Add more cases for different layout types if needed
    default:
      return []; // Default layout
  }
};
