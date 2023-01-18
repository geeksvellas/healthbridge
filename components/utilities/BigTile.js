import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {
  container,
  button,
  buttonText,
  medium,
  light,
  bold,
  font15,
  clickText,
} from '../Styles';
export default function BigTile({children, ...props}) {
  return (
    <TouchableOpacity
      style={[props.style, {flex: 1, paddingTop: 10}]}
      activeOpacity={1}
      onPress={props.pressButton}>
      {/* <Text style={{position: 'absolute'}}>New</Text> */}
      <View
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.8,
              shadowRadius: 2,
            },
            android: {
              elevation: 10,
            },
          }),
        }}>
        <Image
          source={props.pic}
          style={{
            width: '100%',
            // aspectRatio: 3 / 4,
            resizeMode: 'stretch',
          }}
        />
      </View>
      {props.title && (
        <Text
          style={[
            medium,
            {
              paddingVertical: 10,
              textAlign: 'left',
              color: 'black',
              paddingLeft: 10,
            },
          ]}>
          {props.title}
        </Text>
      )}
      {props.sub && (
        <Text
          style={[
            light,
            {textAlign: 'left', color: 'rgba(0,0,0,0.6)', paddingLeft: 10},
          ]}>
          {props.sub}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
