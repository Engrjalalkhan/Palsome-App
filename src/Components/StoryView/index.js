import * as React from 'react';
import {View, StyleSheet, Image, TextInput, Text} from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import { COLORS } from '../../Constants/Colors';

export default function StoryView({image, name, mode, style, ...props}) {
  return (
    <View style={styles.main}>
      <View
        style={[
          styles.circle,
          mode === 'active' && {borderColor: COLORS.primary},
          style,
        ]}
        mode={mode}
        name={name}
        image={image}
        {...props}>
        <Image
          source={image}
          style={[
            styles.imageStyle,
            mode === 'me' && {
              width: widthPercentageToDP('7'),
              height: widthPercentageToDP('7'),
              alignSelf: 'center',
              marginTop: widthPercentageToDP('5.8'),
            },
            style,
          ]}
        />
      </View>
      <Text numberOfLines={1}>{name}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  main: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: widthPercentageToDP('1'),
    marginVertical: widthPercentageToDP('6'),
  },
  circle: {
    height: widthPercentageToDP('19'),
    width: widthPercentageToDP('19'),
    borderRadius: widthPercentageToDP('19'),
    borderWidth: 1,
    borderColor: 'black',
  },
  imageStyle: {
    width: widthPercentageToDP('17'),
    height: widthPercentageToDP('17'),
    alignSelf: 'center',
    borderRadius: widthPercentageToDP('8.5'),
    overflow: 'hidden',
    marginTop: widthPercentageToDP('0.67'),
  },
});
