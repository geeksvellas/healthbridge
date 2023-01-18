import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import BackButton from '../utilities/BackButton';
import CustomButton from '../CustomButton';
import Loader from '../Loader';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import {getUserProfile} from '../functions/Details';

import {medium, clickText, bold, errorText, light} from '../Styles';
import {NavigationHelpersContext} from '@react-navigation/native';
const {width, height} = Dimensions.get('window');

export default function Settings({navigation}) {
  useEffect(() => {}, []);

  return (
    <KeyboardAvoidingView style={{backgroundColor: '#F4F6FA', flex: 1}}>
      <StatusBar backgroundColor="#F4F6FA" />
      <ScrollView>
        <View style={{flexDirection: 'row', paddingVertical: 20}}>
          <BackButton />
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
              alignItems: 'center',
            }}>
            <Text
              style={[
                medium,
                {fontSize: width / 25, paddingHorizontal: 20, color: 'black'},
              ]}>
              Settings
            </Text>
          </View>
        </View>
        <View style={{marginHorizontal: 30}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('UpdatePhone')}
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
              alignItems: 'center',
            }}>
            <Icon size={30} name="document-text" color="#54D9D5" />
            <Text style={[medium, {fontSize: width / 25, marginLeft: 20}]}>
              Change mobile number
            </Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('LinkPhone')}
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
              alignItems: 'center',
            }}>
            <Icon size={30} name="document-text" color="#54D9D5" />
            <Text style={[medium, {fontSize: width / 25, marginLeft: 20}]}>
              Link mobile number
            </Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
              alignItems: 'center',
            }}>
            <Icon size={30} name="documents" color="#54D9D5" />
            <Text style={[medium, {fontSize: width / 25, marginLeft: 20}]}>
              Link alternate login
            </Text>
          </TouchableOpacity> */}
          {/* <TouchableOpacity
            onPress={() => navigation.navigate('UpgradeMembership')}
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
              alignItems: 'center',
            }}>
            <Icon size={30} name="documents" color="#54D9D5" />
            <Text style={[medium, {fontSize: width / 25, marginLeft: 20}]}>
              Membership
            </Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
