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

export default function TextImageTile({children, ...props}) {
  return (
    <TouchableOpacity
      style={[props.style, {paddingVertical: 15, flex: 1}]}
      activeOpacity={1}
      onPress={() => props.pressButton(props.title)}>
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          minHeight: 150,
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
            paddingVertical: 10,
          }}>
          <View style={{paddingRight: 10}}>
            <Text
              style={[
                medium,
                {
                  paddingTop: 10,
                  textAlign: 'left',
                  color: 'black',
                  fontSize: 15,
                  fontWeight: 'bold',
                },
              ]}>
              {props.sub.title ? props.sub.title + ' ' : ''}
              {props.title}
            </Text>
            {props.sub && (
              <View>
                <Text
                  style={[
                    light,
                    {paddingTop: 10, textAlign: 'left', color: 'black'},
                  ]}>
                  {props.sub.speciality && Array.isArray(props.sub.speciality)
                    ? props.sub.speciality
                        .map(word =>
                          word.replace(
                            word[0],
                            word[0].toString().toUpperCase(),
                          ),
                        )
                        .join(',')
                    : props.sub.speciality}
                </Text>
                <Text
                  style={[
                    light,
                    {paddingTop: 10, textAlign: 'left', color: 'black'},
                  ]}>
                  {props.sub.oaddress}
                </Text>
                <Text
                  style={[
                    light,
                    {paddingTop: 10, textAlign: 'left', color: 'black'},
                  ]}>
                  {/* {props.sub.bio} */}
                </Text>
              </View>
            )}
          </View>
          <Text style={[medium, {textAlign: 'left', color: 'black'}]}>
            {props.quote}
          </Text>
        </View>
        <Image
          source={props.pic}
          style={{
            // flex: 1,
            borderRadius: 150,
            // borderTopLeftRadius: 100,
            // borderBottomLeftRadius: 10,
            height: 140,
            width: 140,
            marginRight: 10,
            marginTop: 5,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
