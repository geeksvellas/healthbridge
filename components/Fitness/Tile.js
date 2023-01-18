import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {medium, dropShadow, bold, light} from '../Styles';
const {width, height} = Dimensions.get('window');

export default function Tile({field, value, icon, unit}) {
  return (
    <View
      style={[
        dropShadow,
        {
          backgroundColor: '#7265e3',
          padding: 10,
          borderRadius: 16,
          flex: 1,
          margin: 5,
        },
      ]}>
      <Icon name={icon} size={40} color="white" />
      <Text
        style={[
          light,
          {fontSize: width / 25, paddingVertical: 10, color: 'white'},
        ]}>
        {field}
      </Text>
      <Text style={[medium, {fontSize: width / 15, color: 'white'}]}>
        {value} {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
