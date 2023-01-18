import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ProgressBar from '../utilities/ProgressBar';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {medium, light, font15, clickText} from '../Styles';
import CustomButton from '../CustomButton';
const {width, height} = Dimensions.get('window');
export default function Fourth({navigation}) {
  return (
    <View
      style={{
        backgroundColor: '#EAFDFB',
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 20,
      }}>
      <StatusBar backgroundColor="#EAFDFB" barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{flex: 1}}
        showsVerticalScrollIndicator={false}
        sty>
        <View style={{alignItems: 'center', flex: 1}}>
          <ProgressBar step={4} max={4} />
          <Image
            style={{
              resizeMode: 'contain',
            }}
            source={require('../../assets/onboarding3.png')}
          />
          <Text
            style={[
              medium,
              {
                fontSize: Dimensions.get('window').width / 25,
                lineHeight: 30,
                paddingTop: 30,
                padding: 10,
                alignItems: 'center',
                color: '#4C5980',
                textAlign: 'center',
              },
            ]}>
            Bridging the gap of medicare knowledge between doctors, patients, &
            caregivers
          </Text>
          <Text
            style={[
              light,
              {
                fontSize: Dimensions.get('window').width / 25,
                color: '#4C5980',
                padding: 10,
                textAlign: 'center',
              },
            ]}>
            Our library of educational courses, training programs and webinars
            are just a click away
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomButton pressButton={() => navigation.navigate('SignIn')}>
            Continue
          </CustomButton>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
