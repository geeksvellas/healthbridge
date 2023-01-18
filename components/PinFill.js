import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './Loader';
// import OpenPGP from 'react-native-fast-openpgp';
import base64 from 'react-native-base64';
const {width, height} = Dimensions.get('window');

export default function PinFill({navigation, route}) {
  const [pin, setpin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const {name, gender, uname, email} = route.params;
  const [loading, setloading] = useState(false);
  const {currentUser} = auth();
  const setData = () => {
    firestore()
      .collection('patient')
      .doc(currentUser.uid)
      .set({
        fname: name.fname,
        lname: name.lname,
        gender: gender,
        phone: currentUser.phoneNumber,
        email: email.toLowerCase(),
        uname: uname,
      })
      .then(async () => {
        // await AsyncStorage.setItem('@passphrase', pin);
        setloading(false);
        navigation.replace('loggedInContainer');
      })
      .catch(() => {
        setloading(false);
        setErrorMsg('Something went wrong');
      });
  };
  const generatePin = async () => {
    setloading(true);
    const keyPair = virgilCrypto.generateKeys();
    firestore()
      .collection('privateKeys')
      .doc(currentUser.uid)
      .set({
        key: keyPair.privateKey,
      })
      .then(() => {
        firestore()
          .collection('publicKeys')
          .doc(currentUser.uid)
          .set({
            key: keyPair.publicKey,
          })
          .then(() => {
            firestore()
              .collection('patient')
              .doc(currentUser.uid)
              .set({
                fname: name.fname,
                lname: name.lname,
                gender: gender,
                phone: currentUser.phoneNumber,
                email: email.toLowerCase(),
                uname: uname,
              })
              .then(async () => {
                await AsyncStorage.setItem('@passphrase', pin);
                setloading(false);
                navigation.replace('loggedInContainer');
              })
              .catch(() => {
                setloading(false);
                setErrorMsg('Something went wrong');
              });
          })
          .catch(() => {
            setloading(false);
            setErrorMsg('Something went wrong');
          });
      })
      .catch(() => {
        setloading(false);
        setErrorMsg('Something went wrong');
      });
  };

  return (
    <View style={container}>
      <BackButton style={{width: width * 0.95}} />
      <Loader visible={loading} />

      <ProgressBar step={5} />
      <Text style={[medium, clickText, font15]}>Step 5/5</Text>
      <Text style={[bold, styles.heading, {paddingTop: 40}]}>
        {`Create a 6 digit PIN`}
      </Text>
      <Text
        style={[
          light,
          errorText,
          {paddingTop: 20, paddingHorizontal: 30},
        ]}>{`This PIN will be used for end-to-end encryption of your medical data. If this PIN is lost, you will loose access to your medical records. THIS PIN CANNOT BE RECOVERED`}</Text>
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
          autoFocus={true}
          style={[
            medium,
            font15,
            {padding: 10, textAlign: 'center', color: 'black'},
          ]}
          value={pin}
          keyboardType="number-pad"
          maxLength={6}
          placeholderTextColor="rgba(0,0,0,0.4)"
          onChangeText={value => {
            setErrorMsg('');
            setpin(value);
          }}
        />
      </View>
      <CustomButton pressButton={setData}>Continue</CustomButton>
    </View>
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
