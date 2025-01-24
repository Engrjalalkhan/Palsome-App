import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import { COLORS } from '../../../Constants/Colors';

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: COLORS.white,
  },
  main: {
    fontFamily: 'Roboto-Bold',
    fontSize: 36,
  },
  sub: {
    fontFamily: 'Roboto-Bold',
    fontSize: 18,
  },
  textmain: {
    width: widthPercentageToDP('80'),
    alignItems: 'center',
    marginTop: widthPercentageToDP('8%'),
  },
  textmain2: {
    width: widthPercentageToDP('80'),
    marginTop: widthPercentageToDP('5%'),
    aspectRatio: 2 / 2,
  },
  imagecont: {
    resizeMode: 'contain',
    marginTop: widthPercentageToDP('4'),
  },
  img: {
    marginTop: widthPercentageToDP('1'),
    resizeMode: 'contain',
  },
});
export default styles;
