import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Linking,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {medium, clickText, bold, light} from '../Styles';
import qs from 'qs';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import BackButton from '../utilities/BackButton';
import CustomButton from '../CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../config';

const {width} = Dimensions.get('window');

export default function Disclaimer({navigation}) {
  const [errorMsg, seterrorMsg] = useState('');

  const OAuth = client_id => {
    try {
      console.log('aya');

      var EventList = Linking.addEventListener('url', handleUrl);
      async function handleUrl(event) {
        console.log(event);
        EventList.remove();
        const [, query_string] = event.url.match(/\#(.*)/);
        console.log(query_string);
        const query = qs.parse(query_string);
        console.log(`query: ${JSON.stringify(query)}`);
        const jsonValue = JSON.stringify(query);
        await AsyncStorage.setItem('@token', jsonValue);
        navigation.navigate('Connect');

        // cb(query.access_token, query.user_id);
      }
      const oauthurl = `https://www.fitbit.com/oauth2/authorize?${qs.stringify({
        client_id,
        response_type: 'token',
        scope: 'heartrate activity social weight nutrition profile sleep',
        redirect_uri: 'healthbridge://healthdoc',
        expires_in: '31536000',
      })}`;
      Linking.openURL(oauthurl)
        .then(resp => {
          console.log('yo', resp);
        })
        .catch(err => {
          console.log('Error processing linking', err),
            seterrorMsg(JSON.stringify(err));
        });
    } catch (e) {
      // saving error
      console.log(e, 'error1');
      seterrorMsg(JSON.stringify(e));
    }
  };
  const connectFitbit = async () => {
    OAuth(config.client_id);
  };
  // useEffect(() => {
  //   connectFitbit();
  // }, []);

  return (
    <View style={{backgroundColor: '#F4F6FA', flex: 1}}>
      <StatusBar backgroundColor="#F4F6FA" barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
            }}>
            <BackButton />
            <View style={{paddingTop: 20, paddingLeft: 20}}>
              <Text style={[medium, {fontSize: width / 20}]}>
                Privacy & your Fitbit device
              </Text>
              <Text style={[light, {paddingTop: 10}]}>
                Advance fitness & health tracker
              </Text>
            </View>
          </View>
          <View style={{marginHorizontal: 30}}>
            <Text
              style={[
                light,
                {
                  color: '#979797',
                  fontWeight: 'bold',
                  fontSize: width / 25,
                },
              ]}>
              {`Upon accept: 
            \n1) We will access your data from Fitbit. For displaying the data on HealthDoc App.
             \nYour personal information will not be collected to use for any tracking or other purposes.`}
            </Text>
            {/* <Text
            style={{
              paddingTop: 30,
              color: '#969696',
              fontSize: width / 25,
            }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquet
            donec consequat leo erat pellentesque vitae. In sapien consectetur
            tellus molestie nunc, ac, molestie est. Sit mauris ut egestas ac
            pretium sit. Tortor mi netus nisl, cum.
          </Text> */}
            <Text
              style={[
                light,
                {
                  paddingTop: 20,
                  color: '#979797',
                  fontWeight: 'bold',
                  fontSize: width / 25,
                  textAlign: 'center',
                },
              ]}>
              You must read and accept to continue
            </Text>
          </View>
        </ScrollView>
        <View style={{alignItems: 'center'}}>
          <CustomButton pressButton={connectFitbit}>Setup</CustomButton>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({});
