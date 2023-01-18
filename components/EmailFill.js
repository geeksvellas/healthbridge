import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput,
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
  errorText,
} from './Styles';
import BackButton from './utilities/BackButton';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import CustomButton from './CustomButton';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import ProgressBar from './utilities/ProgressBar';
import Loader from './Loader';
import {firebase} from '@react-native-firebase/functions';
// import {virgilCrypto} from 'react-native-virgil-crypto';
const {width, height} = Dimensions.get('window');

export default function EmailFill({navigation, route}) {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [confpass, setconfpass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const {name, gender} = route.params;
  const [loading, setloading] = useState(false);
  const {currentUser} = auth();
  // console.log(currentUser.uid, currentUser.phoneNumber);
  const onContinue = () => {
    setloading(true);
    if (password == confpass) {
      if (email && password) {
        auth()
          .currentUser.getIdToken(true)
          .then(function (idToken) {
            firebase
              .app()
              .functions('asia-east2')
              .httpsCallable('SavePatientData?token=' + idToken)({
                body: {
                  fname: name.fname,
                  lname: name.lname,
                  gender: gender,
                  phone: currentUser.phoneNumber,
                  email: email.toLowerCase(),
                  status: 0,
                },
                status: 0,
                patientID: currentUser.uid,
              })
              .then(async () => {
                try {
                  var credential =
                    await firebase.auth.EmailAuthProvider.credential(
                      email.toLowerCase(),
                      password,
                    );
                  auth()
                    .currentUser.linkWithCredential(credential)
                    .then(
                      function (usercred) {
                        var user = usercred.user;
                        console.log('Account linking success', user);
                        setloading(false);
                        navigation.replace('loggedInContainer');
                      },
                      function (error) {
                        setloading(false);
                        if (error.code == 'auth/email-already-in-use') {
                          setErrorMsg(
                            'The email address is already in use by another account.',
                          );
                        } else if (error.code == 'auth/unknown') {
                          setErrorMsg(
                            'Another email address is already linked to this account. Kindly contact admin',
                          );
                        } else {
                          if (error.meessage) {
                            setErrorMsg(error.meessage);
                          } else {
                            setErrorMsg(
                              'Something went wrong. Kindly try after sometime',
                            );
                          }
                        }
                        console.log('Account linking error', error);
                      },
                    );
                } catch (error) {
                  setloading(false);
                  console.log('link error', error);
                }
              })
              .catch(error => {
                console.log(error);
                setloading(false);
                setErrorMsg('Something went wrong');
              });
          })
          .catch(err => {
            setloading(false);
            console.log(err);
          });
      } else {
        setloading(false);
        setErrorMsg('Please provide all fields');
      }
    } else {
      setloading(false);
      setErrorMsg('Password does not match');
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={container}>
        <BackButton style={{width: width * 0.95}} />
        <Loader visible={loading} />

        <ProgressBar step={3} max={3} />
        <Text style={[medium, clickText, font15]}>Step 3/3</Text>
        <Text style={[bold, styles.heading, {paddingTop: 40}]}>
          {`Add an alternative \n login`}
        </Text>
        <Text style={[errorText, {paddingHorizontal: 20, textAlign: 'center'}]}>
          {errorMsg}
        </Text>
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
            autoFocus={true}
            style={[
              medium,
              font15,
              {padding: 10, textAlign: 'center', flex: 1, color: 'black'},
            ]}
            value={email}
            placeholder="Enter email"
            keyboardType="email-address"
            placeholderTextColor="rgba(0,0,0,0.4)"
            onChangeText={value => {
              setErrorMsg('');
              setemail(value);
            }}
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
            marginVertical: 20,
          }}>
          <TextInput
            autoFocus={true}
            style={[
              medium,
              font15,
              {padding: 10, textAlign: 'center', flex: 1, color: 'black'},
            ]}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="rgba(0,0,0,0.4)"
            onChangeText={value => {
              setErrorMsg('');
              setpassword(value);
            }}
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
            marginVertical: 20,
          }}>
          <TextInput
            autoFocus={true}
            style={[
              medium,
              font15,
              {padding: 10, textAlign: 'center', flex: 1, color: 'black'},
            ]}
            value={confpass}
            placeholder="Confirm password"
            secureTextEntry={true}
            placeholderTextColor="rgba(0,0,0,0.4)"
            onChangeText={value => {
              setErrorMsg('');
              setconfpass(value);
            }}
          />
        </View>
        <CustomButton pressButton={onContinue}>Continue</CustomButton>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: width / 15,
    textAlign: 'center',
  },
  sub: {
    paddingVertical: 30,
    fontSize: 15,
  },
});
