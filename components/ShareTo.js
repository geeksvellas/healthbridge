import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  Dimensions,
  TextInput,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
} from 'react-native';
import BackButton from './utilities/BackButton';
import {medium, clickText, bold, font15, light} from './Styles';

const {width, height} = Dimensions.get('window');
export default function ShareTo({route, navigation}) {
  const {value} = route.params;
  // const [results, setresults] = useState(value.testResults);

  useEffect(() => {}, []);

  return (
    <KeyboardAvoidingView
      style={{backgroundColor: '#F4F6FA', flex: 1, paddingTop: 30}}>
      <StatusBar backgroundColor="#F4F6FA" />
      <BackButton />
      <View style={{flex: 1, marginHorizontal: 20}}>
        <TouchableOpacity
          style={[{paddingVertical: 15}]}
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('AppointmentsModal', {value: value})
          }>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              height: 150,
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
              <View>
                <Text
                  style={[
                    medium,
                    {paddingVertical: 10, textAlign: 'left', color: 'black'},
                  ]}>
                  Share with doctor
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/Oval.png')}
              style={{
                flex: 1,
                borderRadius: 16,
                borderTopLeftRadius: 100,
                borderBottomLeftRadius: 10,
                height: '100%',
              }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[{paddingVertical: 15, flex: 1}]}
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('ShareReportMember', {value: value})
          }>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              height: 150,
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
              <View>
                <Text
                  style={[
                    medium,
                    {paddingVertical: 10, textAlign: 'left', color: 'black'},
                  ]}>
                  Share with family member
                </Text>
              </View>
            </View>
            <Image
              source={require('../assets/Oval.png')}
              style={{
                flex: 1,
                borderRadius: 16,
                borderTopLeftRadius: 100,
                borderBottomLeftRadius: 10,
                height: '100%',
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
