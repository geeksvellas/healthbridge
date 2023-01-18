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
export default function Third({navigation}) {
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
          <ProgressBar step={3} max={4} />
          <Image
            style={{
              resizeMode: 'contain',
            }}
            source={require('../../assets/onboarding2.png')}
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
            By using blockchain technology in our system, your health data is
            secured with us
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
            Blockchain is a system of recording information in a way that makes
            it difficult or impossible to change, hack or cheat the system
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomButton pressButton={() => navigation.navigate('Fourth')}>
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
