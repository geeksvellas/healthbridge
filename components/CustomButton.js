import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
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
} from './Styles';
const {width, height} = Dimensions.get('window');
export default function CustomButton({children, ...props}) {
  return (
    <View>
      <TouchableOpacity
        style={[button, {width: width * 0.7, marginVertical: 20}]}
        onPress={props.pressButton}>
        <Text style={[buttonText, medium, font15]}>{children}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
