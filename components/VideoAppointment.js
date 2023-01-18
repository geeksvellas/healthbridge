import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import {medium, light, bold} from './Styles';
import AgoraUIKit from 'agora-rn-uikit';
import config from '../config';
const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
var timeOut;
export default function VideoAppointment({route, navigation}) {
  const [videoCall, setVideoCall] = useState(true);
  const [timeRemaining, settimeRemaining] = useState(null);
  const [alertColor, setalertColor] = useState('rgba(255,255,255,0.4)');
  const {channel, token, endTime, startTime} = route.params;
  const rtcProps = {
    appId: config.agora_key,
    channel: channel,
    token: token,
  };
  const padLeadingZeros = num => {
    var s = num + '';
    while (s.length < 2) s = '0' + s;
    return s;
  };
  const tConvert = time => {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  };
  useEffect(() => {
    timeOut = setInterval(alertFunc, 1000);
    return () => clearTimeout(timeOut);
  }, []);
  const alertFunc = () => {
    var countDownDate = startTime;

    // Get today's date and time
    var now = new Date().getTime();
    console.log(startTime, 'startTime');
    console.log(now, 'Now');

    if (countDownDate <= now) {
      // Find the distance between now and the count down date
      var distance = now - countDownDate;

      // Time calculations for days, hours, minutes and seconds
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      var timeRemaining =
        new Date('01/01/2007 ' + endTime.split('-')[1] + ':00').getTime() -
        new Date('01/01/2007 ' + endTime.split('-')[0] + ':00').getTime();
      var diff = Math.abs(
        Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)),
      );
      // console.log(diff);
      settimeRemaining(
        doubleDigit(hours) +
          ':' +
          doubleDigit(minutes) +
          ':' +
          doubleDigit(seconds),
      );
      if (minutes > diff) {
        setalertColor('rgba(255,0,0,0.4)');
      }
    }
  };
  const doubleDigit = time => {
    return ('0' + time).slice(-2);
  };
  const callbacks = {
    RtcStats: val => {
      console.log('Rtc', val);
    },
    EndCall: data => {
      console.log(data);
      setVideoCall(false);
      navigation.pop();
    },
  };
  return videoCall ? (
    <SafeAreaView>
      {timeRemaining && (
        <View
          style={{
            position: 'absolute',
            top: 30,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'flex-end',
            zIndex: 100,
            height: 50,
            paddingRight: 10,
          }}>
          <Text
            style={{
              padding: 10,
              backgroundColor: alertColor,
              borderRadius: 10,
              overflow: 'hidden',
              color: '#fff',
            }}>
            {timeRemaining}
          </Text>
        </View>
      )}
      <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
    </SafeAreaView>
  ) : (
    <Text onPress={() => setVideoCall(true)}>Start Call</Text>
  );
}

const styles = StyleSheet.create({
  max: {
    flex: 1,
  },
  buttonHolder: {
    height: 100,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#0093E9',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
  },
  fullView: {
    width: dimensions.width,
    height: dimensions.height - 100,
  },
  remoteContainer: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 5,
  },
  UIKitContainer: {
    height: dimensions.height - 40,
  },
  remote: {
    width: 150,
    height: 150,
    marginHorizontal: 2.5,
  },
  noUserText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#0093E9',
  },
});
