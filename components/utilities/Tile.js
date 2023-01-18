import React from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
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
const {width, height} = Dimensions.get('window');

export default function Tile({children, ...props}) {
  return (
    <TouchableOpacity
      onPress={() => props.pressButton(children)}
      style={{
        paddingVertical: 15,
        width: '30%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        ...props.style,
      }}>
      <Image
        style={{width: width * 0.15, height: width * 0.15}}
        source={props.pic}
        resizeMode="contain"
      />
      <Text
        style={[
          props.style,
          light,
          {paddingTop: 10, textAlign: 'center', color: 'black'},
        ]}>
        {children}
      </Text>
      <Text style={[props.style, light, {textAlign: 'center', color: 'black'}]}>
        {props.desc}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
