import React, {useRef, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {
  container,
  button,
  buttonText,
  medium,
  light,
  bold,
  font15,
  clickText,
  errorText,
} from './Styles';
import BackButton from './utilities/BackButton';
import firestore from '@react-native-firebase/firestore';
import CustomButton from './CustomButton';
import Loader from './Loader';
import auth from '@react-native-firebase/auth';
const {width, height} = Dimensions.get('window');
export default function VerifyNumber({route, navigation}) {
  const {number} = route.params;
  const pin1 = useRef(null);
  const [pin1Val, setPin1Val] = useState(null);
  const [loading, setloading] = useState(false);
  const [errorMsg, seterrorMsg] = useState('');

  // If null, no SMS has been sent
  const [confirm, setConfirm] = useState(null);

  const onContinue = () => {
    // setCode('1234');
    if (pin1Val) {
      setloading(true);
      confirmCode(pin1Val);
    } else {
      seterrorMsg('Invalid code entered');
    }
  };
  // Handle the button press
  async function signInWithPhoneNumber(phoneNumber) {
    setloading(true);
    try {
      auth()
        .signInWithPhoneNumber(phoneNumber, true)
        .then(confirmation => {
          setloading(false);
          console.log('verified');
          setConfirm(confirmation);
        })
        .catch(err => {
          setloading(false);
          var etext;
          if (err.message) {
            etext = err.message;
          } else {
            etext = err;
          }
          console.log('Errororor', etext);
          seterrorMsg(JSON.stringify(etext));
        });
      // console.log(confirmation, 'confirm');
    } catch (e) {
      setloading(false);

      console.log(e);
      if (e.code == 'auth/too-many-requests') {
        seterrorMsg(
          'Due to too many requests. unusual activity. Try again later',
        );
      } else if (e.code == 'auth/unknown') {
        seterrorMsg('session expired');
      } else if (e.code == 'auth/session-expired') {
        seterrorMsg(
          'The sms code has expired. Please re-send the verification code to try again.',
        );
      } else {
        // navigation.pop();
        seterrorMsg(JSON.stringify(e));
      }

      // seterrorMsg('Cannot reach your phone. Retrying...');
    }
  }

  async function confirmCode(codes) {
    const {currentUser} = auth();
    setloading(true);
    if (currentUser && currentUser.uid) {
      firestore()
        .collection('patient')
        .doc(currentUser.uid)
        .get()
        .then(documentSnapshot => {
          // console.log('User exists: ', documentSnapshot.exists);
          if (documentSnapshot.exists) {
            setloading(false);
            navigation.replace('loggedInContainer');
          } else {
            setloading(false);
            navigation.replace('firstLogIn', {phone: number});
          }
        });
    } else {
      try {
        console.log(codes);
        await confirm.confirm(codes);
        const {currentUser} = auth();
        if (currentUser) {
          firestore()
            .collection('patient')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => {
              // console.log('User exists: ', documentSnapshot.exists);
              if (documentSnapshot.exists) {
                setloading(false);
                navigation.replace('loggedInContainer');
              } else {
                setloading(false);
                navigation.replace('firstLogIn', {phone: number});
              }
            });
        }
        // navigation.replace('firstLogIn');
      } catch (error) {
        // if(error)
        setloading(false);
        if (error.code == 'auth/invalid-verification-code') {
          seterrorMsg('Invalid code provided');
        } else if (error.code == 'auth/session-expired') {
          seterrorMsg('This code has expired');
        } else {
          seterrorMsg('Something went wrong. Try again');
        }
        console.log(error, 'error1');
        // seterrorMsg(error);
      }
    }
  }
  const sendCode = () => {
    seterrorMsg('');
    signInWithPhoneNumber(number);
  };

  function onAuthStateChanged(user) {
    console.log(user, 'Auth change');
    if (user) {
      setloading(true);
      firestore()
        .collection('patient')
        .doc(user.uid)
        .get()
        .then(documentSnapshot => {
          // console.log('User exists: ', documentSnapshot.exists);
          if (documentSnapshot.exists) {
            setloading(false);
            navigation.replace('loggedInContainer');
          } else {
            setloading(false);
            navigation.replace('firstLogIn', {phone: number});
          }
        });
    }
  }

  useEffect(() => {
    signInWithPhoneNumber(number);
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    // <KeyboardAvoidingView
    //   behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    //   style={{flex: 1}}>
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <View style={container}>
          <BackButton style={{width: width * 0.95}} />
          <Loader visible={loading} />

          <Text style={[bold, styles.heading]}>Verfiy your number</Text>
          <Text style={[light, styles.sub]}>We'll text you on {number}</Text>
          <Text style={[errorText, {paddingHorizontal: 10}]}>{errorMsg}</Text>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
              paddingHorizontal: 20,
            }}>
            <TextInput
              style={styles.otpInput}
              ref={pin1}
              value={pin1Val}
              autoFocus={true}
              keyboardType="number-pad"
              onChangeText={text => {
                seterrorMsg('');
                setPin1Val(text);
              }}
            />
          </View>
          <TouchableOpacity onPress={sendCode} style={{paddingVertical: 10}}>
            <Text style={[medium, clickText, font15]}>Send me a new code</Text>
          </TouchableOpacity>
          {/* <Text style={(light, font15)}>{timer}</Text> */}
          <CustomButton pressButton={onContinue}>Continue</CustomButton>
        </View>
      </ScrollView>
    </SafeAreaView>
    // </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: width / 15,
    textAlign: 'center',
  },
  sub: {
    paddingVertical: 10,
    fontSize: 15,
  },
  otpInput: {
    backgroundColor: '#FFF',
    borderRadius: 50,
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 5,
    color: 'black',
    paddingVertical: 10,
  },
});
