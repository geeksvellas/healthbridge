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

export default function HTile({children, ...props}) {
  return (
    <TouchableOpacity
      style={[props.style, {paddingVertical: 15, marginHorizontal: 30}]}
      activeOpacity={1}
      onPress={() => props.pressButton(props.title)}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          paddingLeft: 20,
          borderRadius: 16,
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
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingVertical: 20,
          }}>
          <View>
            <Text style={[medium, {textAlign: 'left', color: 'black'}]}>
              {props.title}
            </Text>
            {props.sub && (
              <Text
                style={[
                  light,
                  {paddingTop: 10, textAlign: 'left', color: 'rgba(0,0,0,0.6)'},
                ]}>
                {props.sub}
              </Text>
            )}
          </View>
        </View>
        {props.pic && (
          <Image
            source={props.pic}
            style={{
              height: '100%',
              width: 80,
              marginRight: 10,
              resizeMode: 'contain',
            }}
          />
        )}
        {props.rightContent && (
          <Text
            style={[
              medium,
              {
                paddingVertical: 20,
                paddingRight: 20,
                textAlign: 'left',
                color: 'black',
              },
            ]}>
            {props.rightContent}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
