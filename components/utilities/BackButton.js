import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/dist/Entypo';

export default function BackButton({children, ...props}) {
  const navigation = useNavigation();
  // console.log(Platform.OS);
  return (
    <View
      style={[
        {
          // width: width * 0.95,
          // paddingVertical: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        },
        props.style,
      ]}>
      {Platform.OS == 'ios' && (
        <TouchableOpacity onPress={() => navigation.pop()}>
          <Icon name="chevron-left" size={30} color="#000" />
        </TouchableOpacity>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({});
