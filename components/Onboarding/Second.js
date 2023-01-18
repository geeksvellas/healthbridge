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
export default function Second({navigation}) {
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
          <ProgressBar step={2} max={4} />
          <Image
            style={{
              resizeMode: 'contain',
            }}
            source={require('../../assets/onboarding1.png')}
          />
          <Text
            style={[
              medium,
              {
                fontSize: Dimensions.get('window').width / 25,
                lineHeight: 30,
                padding: 10,
                alignItems: 'center',
                color: '#4C5980',
                textAlign: 'center',
              },
            ]}>
            Consult with our specialist doctors right at your fingertip
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
            No more going to the doctor’s office or sit in a waiting room when
            you’re sick. You can make an appointment and see your doctor from
            the comfort of your own home
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomButton pressButton={() => navigation.navigate('Third')}>
            Continue
          </CustomButton>
        </View>

        <View
          style={{
            paddingBottom: 20,
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={[medium, clickText, font15, {color: '#54D9D5'}]}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
