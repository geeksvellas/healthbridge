import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

var userProfile = null;
var pin = null;
var usersSubscriber = [];
export const getUserProfile = () => {
  return userProfile;
};
export const signOutMain = async () => {
  const {currentUser} = auth();
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log(fcmToken, 'token');
  firestore()
    .collection('notificationToken')
    .doc(currentUser.uid)
    .update({
      token: firestore.FieldValue.arrayRemove(fcmToken),
    })
    .then(async () => {
      for (var i = 0; i < usersSubscriber.length; i++) {
        usersSubscriber[i]();
      }
      auth().signOut();
      AsyncStorage.removeItem('fcmToken');
      console.log('Token removed!');
    });
};
export const setSubscriber = func => {
  usersSubscriber.push(func);
};
export const setUserProfile = userData => {
  userProfile = userData;
};
export const alertMessage = () => {
  alert('Message');
};
export const setPin = safePin => {
  pin = safePin;
};
export const getPin = () => {
  return pin;
};
