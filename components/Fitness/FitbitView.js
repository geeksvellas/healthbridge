import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Disclaimer from './Disclaimer';
import Connect from './Connect';

export default function FitbitView() {
  const [existingLogin, setexistingLogin] = useState(null);
  const [checking, setchecking] = useState(false);
  useEffect(async () => {
    try {
      const value = await AsyncStorage.getItem('@token');
      if (value !== null) {
        var val = JSON.parse(value);
        setexistingLogin(1);
        // getData(val.access_token, val.user_id);
      } else {
        // OAuth(config.client_id, getData);
        setexistingLogin(2);
      }
    } catch (e) {
      console.log('error reading value');
    }
  }, []);
  return (
    <View style={{flex: 1}}>
      {existingLogin == 1 ? (
        <Connect />
      ) : existingLogin == 2 ? (
        <Disclaimer />
      ) : (
        <View></View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});
