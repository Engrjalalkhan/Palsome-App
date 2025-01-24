import {View} from 'react-native';
import React from 'react';
import {FlatList} from 'react-native';
import FastImage from 'react-native-fast-image';
import VideoPlayer from 'react-native-video-player';
import {HP} from '../../../Utils/Resposive';
import {WidthScreen} from '../TopBar/Dimensions';
import {RenderItemImages, RenderItemVideos} from './RenderItem';
import {getHeight} from '../../../Utils/NewResponsive';
import {imgRegex} from '../../../Utils/Regexes/imgVideoRegex';
import {ICONS} from '../../Constants/Icons';
import {COLORS} from '../../Constants/Colors';

export const ShowImagesAndVideos = (item, deletItem) => {
  console.log('item - - ', item.item.type);
  return (
    <View style={{flex: 1}}>
      {item.item.type.match(imgRegex) ? (
        <View style={{flexDirection: 'row-reverse'}}>
          {ICONS.fontAwesome5('times-circle', COLORS.red, 14, () =>
            deletItem(item.item.uri),
          )}
          <FastImage
            key={item.index}
            resizeMode="cover"
            style={{
              width: WidthScreen * 0.5,
              height: getHeight(17),
              marginTop: HP(1),
              borderLeftColor: COLORS.white,
              borderLeftWidth: 1,
            }}
            source={{
              uri: item.item.uri,
            }}
          />
        </View>
      ) : (
        <View
          key={item.index}
          style={{
            width: WidthScreen * 0.8,
            height: getHeight(18),

            flexDirection: 'row-reverse',
          }}>
          {ICONS.fontAwesome5('times-circle', COLORS.red, 14, () =>
            deletItem(item.item.uri),
          )}
          <VideoPlayer
            video={{
              uri: item.item.uri,
            }}
            muted={false}
            repeat={false}
            resizeMode={'contain'}
            volume={9.0}
            rate={1.0}
            ignoreSilentSwitch={'ignore'}
            videoWidth={3000}
            videoHeight={1900}
            disableControlsAutoHide={true}
            disableFullscreen={false}
            style={{
              width: WidthScreen * 0.79,
              height: getHeight(18),
            }}
          />
        </View>
      )}
    </View>
  );
};

export const ShowVidsImgs = props => {
  if (props.videoUris && props.imgUris) {
    const thumb = props.thumbnail;
    return (
      <View>
        <FlatList
          style={{flex: 1}}
          data={props.imgUris}
          renderItem={({item, index}) => RenderItemImages({item, index})}
          keyExtractor={(item, index) => index.toString()}
        />
        <FlatList
          style={{flex: 1}}
          data={props.videoUris}
          renderItem={({item, index}) => RenderItemVideos({item, index, thumb})}
          keyExtractor={(item, index) => index.toString()}
          listKey={(item, index) => index.toString()}
        />
      </View>
    );
  }
};
