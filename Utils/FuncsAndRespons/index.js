import {StatusBar, PixelRatio, Dimensions, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
const {height, width} = Dimensions.get('window');

export function isIphoneX() {
  return Platform.OS === 'ios' && DeviceInfo.hasNotch();
}

export function getDateString(date) {
  try {
    let day = '';
    const year = date.getFullYear();
    let month = '';
    if (date.getMonth() + 1 < 10) {
      month = '0' + (date.getMonth() + 1);
    } else {
      month = date.getMonth() + 1;
    }
    if (date.getDate() < 10) {
      day = '0' + date.getDate();
    } else {
      day = date.getDate();
    }

    const dateStr = month + '-' + day + '-' + year;
    return dateStr;
  } catch (e) {
    console.log(e);
  }
}

export function validateForm(object) {
  const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const phoneReg =
    /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/;

  const entries = Object.entries(object);
  for (let i = 0; i < entries.length; i++) {
    if (entries[i][1] == '' || entries[i][1] == null || entries[i][1] == 0) {
      const error = entries[i][0] + ' ' + 'is empty';
      return [false, error];
    } else if (entries[i][0].includes('Email')) {
      if (reg.test(entries[i][1]) === false) {
        const error = entries[i][0] + ' ' + 'is invalid';
        return [false, error];
      }
    } else if (entries[i][0].includes('Phone Number')) {
      if (phoneReg.test(entries[i][1]) === false) {
        const error = entries[i][0] + ' ' + 'is invalid';
        return [false, error];
      }
    }
  }
  return [true];
}

export function getTimeString(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export function getHeight(h) {
  const elemHeight = parseFloat(h);
  return PixelRatio.roundToNearestPixel((height * elemHeight) / 100);
}

export function getWidth(w) {
  const elemWidth = parseFloat(w);
  return PixelRatio.roundToNearestPixel((width * elemWidth) / 100);
}

export function getFontSize(font) {
  const deviceHeight = isIphoneX()
    ? height * 0.9
    : Platform.OS === 'android'
    ? height - StatusBar.currentHeight
    : height;
  const deviceHeightPercent = (font * deviceHeight) / 100;
  return Math.round(deviceHeightPercent);
}
