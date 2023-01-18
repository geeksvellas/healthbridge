import React, {useState} from 'react';
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
import CountryList from './utilities/CountryList';
const {width, height} = Dimensions.get('window');

export default function SignIn({navigation}) {
  const [number, setPNumber] = useState('');
  const [errorMsg, seterrorMsg] = useState('');
  const [cc, setcc] = useState({
    cc: '+65',
    icon: require('../assets/icons/country/singapore.png'),
  });
  const [ccVisible, setccVisible] = useState(false);
  const onVerifyNumber = () => {
    if (number) {
      var phoneNumber = cc.cc + number;
      setPNumber('');
      navigation.navigate('VerifyNumber', {number: cc.cc + number});
    } else {
      seterrorMsg('Please enter valid phone number');
    }
  };

  const onSelectCC = item => {
    setccVisible(false);
    setcc(item);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{flex: 1}}>
        <View style={container}>
          <BackButton style={{width: width * 0.95}} />
          <Text style={[bold, styles.heading, {paddingTop: 40}]}>
            Let's start with your mobile number
          </Text>
          <Text style={[light, styles.sub]}>
            Enter phone number to login or register
          </Text>
          <Text style={[errorText]}>{errorMsg}</Text>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              width: 300,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 20,
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
          <CustomButton pressButton={onVerifyNumber}>
            Log in / Register
          </CustomButton>
          <Text>Or</Text>
          {/* <TouchableOpacity>
            <Text
              style={[
                medium,
                {
                  marginVertical: 10,
                  color: 'blue',
                },
              ]}>
              {' '}
              Alternate Login{' '}
            </Text>
          </TouchableOpacity> */}
          <CustomButton pressButton={() => navigation.navigate('ManualSignin')}>
            Login using Email/Password
          </CustomButton>
          <View
            style={{
              marginHorizontal: 30,
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            <Text style={[light]}>
              By logging in or registering, you agree to our
            </Text>
            <TouchableOpacity>
              <Text style={[light]}> Terms of Service </Text>
            </TouchableOpacity>
            <Text style={[light]}> and </Text>
            <TouchableOpacity>
              <Text style={[light]}> Privacy Policy. </Text>
            </TouchableOpacity>
          </View>
          {/* <View style={{flexDirection: 'row', paddingTop: 10}}>
        <Text style={[light, font15]}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.push('SignUp')}>
          <Text style={[medium, clickText, font15]}>Sign Up</Text>
        </TouchableOpacity>
      </View> */}
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
});
