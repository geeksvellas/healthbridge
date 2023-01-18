import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
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
  inputBox,
  errorText,
} from './Styles';
import BackButton from './utilities/BackButton';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import CustomButton from './CustomButton';
import CustomDialog from './utilities/CustomDialog';
import CountryList from './utilities/CountryList';
import auth from '@react-native-firebase/auth';
import Loader from './Loader';

const {width, height} = Dimensions.get('window');

export default function LinkPhone({navigation}) {
  const [number, setPNumber] = useState('');
  const [loading, setloading] = useState(false);
  const [alertVisible, setalertVisible] = useState(false);
  const [alertText, setalertText] = useState(null);
  const [verified, setVerified] = useState(null);
  const [errorMsg, seterrorMsg] = useState('');
  const [pin1Val, setpin1Val] = useState(null);
  const snapshot = useRef(null);
  const [cc, setcc] = useState({
    cc: '+65',
    icon: require('../assets/icons/country/singapore.png'),
  });
  const [ccVisible, setccVisible] = useState(false);
  const onVerifyNumber = async () => {
    if (number) {
      setloading(true);
      console.log(cc.cc + number);
      try {
        snapshot.current = await auth()
          .verifyPhoneNumber(cc.cc + number, 10)
          .on('state_changed', phoneAuthSnapshot => {
            console.log('Snapshot state: ', phoneAuthSnapshot.state);
            if (phoneAuthSnapshot.state == 'verified') {
              setVerified(true);
              setloading(false);
            } else if (phoneAuthSnapshot.state !== 'sent') {
              setloading(false);
              setalertVisible(true);
              setalertText(
                'Error:' +
                  phoneAuthSnapshot.state +
                  '. Please try after sometime.',
              );
            }
          });
      } catch (err) {
        setloading(false);
        seterrorMsg('Something went wrong. Please try again');
      }
    }
  };

  const onSelectCC = item => {
    setccVisible(false);
    setcc(item);
  };
  const updateMobile = async () => {
    var userData = getUserProfile();
    setloading(true);
    const credential = auth.PhoneAuthProvider.credential(
      snapshot.current.verificationId,
      pin1Val,
    );
    console.log('credential', credential);
    await auth()
      .currentUser.updatePhoneNumber(credential)
      .then(data => {
        setloading(false);
        console.log(data, 'success');
        setalertVisible(true);
        setalertText('Your number has been successfully updated.');
      })
      .catch(error => {
        setloading(false);
        console.log(error.message, 'error');
        if (error.message) {
          if (error.code == 'auth/session-expired') {
            seterrorMsg(
              'The sms code has expired. Please re-send the verification code to try again.',
            );
          } else if (error.code == 'auth/credential-already-in-use') {
            seterrorMsg(
              'This credential is already associated with a different user account.',
            );
          } else {
            seterrorMsg(error.message);
          }
        } else {
          seterrorMsg('Something went wrong. Please try again');
        }
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{flex: 1}}>
        <View style={container}>
          <BackButton style={{width: width * 0.95}} />
          <Text style={[light, styles.sub]}>Enter phone number</Text>
          <Text style={[errorText]}>{errorMsg}</Text>
          <Loader visible={loading} />
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              width: 300,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 10,
            }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
              onPress={() => setccVisible(true)}>
              <Image
                source={cc.icon}
                resizeMode="contain"
                style={{
                  height: 30,
                  width: 30,
                }}
              />
              <Text style={[medium, font15, {paddingHorizontal: 10}]}>
                {cc.cc}
              </Text>
              <Icon name="caretdown" size={15} color="#9C9EB9" />
            </TouchableOpacity>
            <TextInput
              autoFocus={true}
              style={[
                medium,
                font15,
                {width: 150, padding: 10, color: 'black'},
              ]}
              value={number}
              keyboardType="number-pad"
              onChangeText={value => {
                seterrorMsg('');
                setPNumber(value);
              }}
              maxLength={13}
              placeholder="xxx-xxxx-xx"
              placeholderTextColor="rgba(0,0,0,0.4)"
            />
          </View>
          <CustomButton pressButton={onVerifyNumber}>Get code</CustomButton>
          <CustomDialog
            visible={alertVisible}
            message={alertText}
            buttonText1="Ok"
            onpressButton1={() => navigation.pop()}
          />
          {verified && (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 20,
                  width: 300,
                }}>
                <TextInput
                  style={styles.otpInput}
                  value={pin1Val}
                  autoFocus={true}
                  keyboardType="number-pad"
                  placeholder="xxxxxx"
                  placeholderTextColor="black"
                  onChangeText={text => {
                    seterrorMsg('');
                    setpin1Val(text);
                  }}
                />
              </View>
              <CustomButton pressButton={updateMobile}>
                Update Number
              </CustomButton>
            </View>
          )}
          <CountryList
            showIcons={true}
            visible={ccVisible}
            onSelect={onSelectCC}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    borderRadius: 16,
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 5,
    color: 'black',
    paddingVertical: 10,
  },
});
