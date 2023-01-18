import React, {Component, useEffect} from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {medium, light, font15, clickText} from '../Styles';
import CustomButton from '../CustomButton';
const {width, height} = Dimensions.get('window');
export default function First({navigation}) {
  useEffect(() => {
    AsyncStorage.setItem('hb-isInstalled', 'true');
  }, []);
  return (
    <View
      style={{
        backgroundColor: '#EAFDFB',
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 20,
      }}>
      <StatusBar backgroundColor="#EAFDFB" barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'center', flex: 1}}>
          <ProgressBar step={1} max={4} />
          <Image
            style={{
              resizeMode: 'contain',
            }}
            source={require('../../assets/onboarding.png')}
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
            Your reliable one-stop healthcare service to take care of your
            well-being
          </Text>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              justifyContent: 'flex-start',
              width: width - 40,
            }}>
            <Icon name="check" size={30} color="#54D9D5" />
            <Text
              style={[
                light,
                {
                  fontSize: Dimensions.get('window').width / 25,
                  color: '#4C5980',
                  paddingLeft: 10,
                },
              ]}>
              Connect with our specialist doctors at your convinence
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              justifyContent: 'flex-start',
              width: width - 40,
            }}>
            <Icon name="check" size={30} color="#54D9D5" />
            <Text
              style={[
                light,
                {
                  fontSize: Dimensions.get('window').width / 25,
                  color: '#4C5980',
                  paddingLeft: 10,
                },
              ]}>
              Store all your health records (including your elder parents and
              children) in one secure system
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              justifyContent: 'flex-start',
              width: width - 40,
            }}>
            <Icon name="check" size={30} color="#54D9D5" />
            <Text
              style={[
                light,
                {
                  fontSize: Dimensions.get('window').width / 25,
                  color: '#4C5980',
                  paddingLeft: 10,
                },
              ]}>
              Join our health community and gain the knowledge of specialist
              care
            </Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CustomButton pressButton={() => navigation.navigate('Second')}>
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
