import { Dimensions, PixelRatio, Platform } from "react-native";

const widthPercentageToDP = (widthPercent) => {
  const screenWidth = Dimensions.get("window").width;
  // Convert string input to decimal number
  const elemWidth = parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};
const heightPercentageToDP = (heightPercent) => {
  const screenHeight = Dimensions.get("window").height;
  // Convert string input to decimal number
  const elemHeight = parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};
export { widthPercentageToDP as WP, heightPercentageToDP as HP };
export const isIphoneX = () => {
  const dimen = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 || dimen.width === 812)
  );
};

export const isIphoneXSM = () => {
  const dimen = Dimensions.get("window");

  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 896 || dimen.width === 896)
  );
};
// export const Lumper = size => {
//   return <DotIndicator color="black" size={size ? size : 20} />;
// };

export const htmlStyle = `<style>
                        #height-calculator {
                          margin: 0;
                          padding: 0;
                        }
                        #height-calculator {
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            margin: 0;
                            padding: 0;
                        }
                        body {
                          width:100%;
                        }
                        h2 {
                          font-size: 48px;
                        }
                        p {
                          font-size: 48px;
                        }
                        h3 {
                          font-size: 32px
                        }
                        img {
                          width:98%;
                        }
                        td {
                          display: block !important;
                          width: 95% !important;
                        }
                        img {
                          width:98%;
                        }
                        hr {
                          width: 98%;
                        }
                        ol li ol li ol li {
                          position: relative; right: 85px;
                        }
                        ul {
                          width: 98%,
                          margin-left: -25px;
                        }
                        li {
                          width: 98%;
                        }
                        .tabs {
                          display: none;
                        }
                        .tabs > li {
                          display: none;
                        }
                        .tabs-content {
                          padding: 0;
                          list-style-type: none;
                        }
                        tr {
                          display: flex;
                          flex-direction: column;
                        }
               </style>`;
