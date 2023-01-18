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
import Loader from './Loader';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('window');

export default function ManualSignin({navigation}) {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [emailIsError, setemailIsError] = useState(null);
  const [passwordIsError, setpasswordIsError] = useState(null);
  const [errorMsg, seterrorMsg] = useState('');
  const [loading, setloading] = useState(false);

  const emailInput = useRef(null);
  const passInput = useRef(null);
  const login = () => {
    if (email && password) {
      setloading(true);
      auth()
        .signInWithEmailAndPassword(email, password)
        .then(data => {
          console.log('User signed in!', data);

          // navigation.replace('loggedInContainer');
          firestore()
            .collection('patient')
            .doc(data.user.uid)
            .get()
            .then(documentSnapshot => {
              console.log('User exists: ', documentSnapshot.exists);
              if (documentSnapshot.exists) {
                setloading(false);
                setEmail(null);
                setPassword(null);
                navigation.replace('loggedInContainer');
              } else {
                setloading(false);
                setEmail(null);
                setPassword(null);
                navigation.replace('firstLogIn', {phone: data.phoneNumber});
              }
            });
        })
        .catch(error => {
          console.log(error);
          setloading(false);
          if (error.code === 'auth/user-not-found') {
            seterrorMsg('User does not exist');
          } else if (error.code === 'auth/invalid-email') {
            seterrorMsg('User invalid');
          } else if (error.code === 'auth/wrong-password') {
            seterrorMsg('Password is incorrect');
          } else if (error.code.includes('network-request-failed')) {
            seterrorMsg('Check your network connection');
          } else {
            seterrorMsg('Something went wrong.');
          }

          // console.log(error.text);
        });
    } else {
      seterrorMsg('Please fill all the fields');
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{flex: 1}}>
        <Loader visible={loading} />
        <View style={container}>
          <BackButton style={{width: width * 0.95}} />
          <Text style={[bold, styles.heading, {paddingTop: 40}]}>
            {`Log in using \n Email/Password`}
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
            <TextInput
              placeholderTextColor="black"
              placeholder="Email"
              style={[
                medium,
                font15,
                {
                  width: '100%',
                  padding: 10,
                  color: 'black',
                  textAlign: 'center',
                },
              ]}
              onChangeText={text => setEmail(text)}
              value={email}
              ref={emailInput}
              keyboardType="email-address"
            />
          </View>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              width: 300,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TextInput
              placeholderTextColor="black"
              placeholder="Password"
              secureTextEntry={true}
              style={[
                medium,
                font15,
                {
                  width: '100%',
                  padding: 10,
                  color: 'black',
                  textAlign: 'center',
                },
              ]}
              onChangeText={text => setPassword(text)}
              value={password}
              ref={passInput}
            />
          </View>
          <CustomButton pressButton={login}>Log in</CustomButton>
          <Text>Or</Text>
          <CustomButton pressButton={() => navigation.navigate('SignIn')}>
            Sign up using Mobile number
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
