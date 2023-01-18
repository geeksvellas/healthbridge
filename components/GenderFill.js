import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
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
import ProgressBar from './utilities/ProgressBar';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/functions';

const {width, height} = Dimensions.get('window');

export default function GenderFill({navigation, route}) {
  const [gender, setgender] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const {name} = route.params;

  const onContinue = () => {
    if (gender) {
      const {currentUser} = auth();
      console.log(currentUser);
      if (currentUser.email !== null) {
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
                  email: currentUser.email,
                  status: 1,
                },
                status: 1,
                patientID: currentUser.uid,
              })
              .then(async () => {
                // setloading(false);
                navigation.replace('loggedInContainer');
              })
              .catch(error => {
                console.log(error);
                // setloading(false);
                setErrorMsg('Something went wrong');
              });
          })
          .catch(err => {
            setloading(false);
            console.log(err);
          });
      } else {
        navigation.navigate('EmailFill', {name: name, gender: gender});
      }
    } else {
      setErrorMsg('Please make a selection');
    }
  };
  return (
    <View style={container}>
      <BackButton style={{width: width * 0.95}} />
      <ProgressBar step={2} max={3} />
      <Text style={[medium, clickText, font15]}>Step 2/3</Text>
      <Text style={[bold, styles.heading, {paddingTop: 40}]}>
        {`Select a gender`}
      </Text>
      <Text style={[errorText]}>{errorMsg}</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            margin: 10,
            padding: 5,
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 10,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.8,
                shadowRadius: 2,
              },
              android: {
                elevation: 10,
              },
            }),
            borderWidth: 2,
            borderColor: gender == 'male' ? '#54D9D5' : 'white',
          }}
          onPress={() => {
            setErrorMsg('');
            setgender('male');
          }}>
          <Image
            style={{width: 100, height: 100}}
            source={require('../assets/icons/gender/male.png')}
          />
          <Text style={medium}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            margin: 10,
            padding: 5,
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 10,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.8,
                shadowRadius: 2,
              },
              android: {
                elevation: 10,
              },
            }),
            borderWidth: 2,
            borderColor: gender == 'female' ? '#54D9D5' : 'white',
          }}
          onPress={() => {
            setErrorMsg('');
            setgender('female');
          }}>
          <Image
            style={{width: 100, height: 100}}
            source={require('../assets/icons/gender/female.png')}
          />
          <Text style={medium}>Female</Text>
        </TouchableOpacity>
      </View>
      <Text
        style={[
          light,
          {fontSize: width / 25, marginVertical: 10, textAlign: 'center'},
        ]}>
        {`To give you a customize experience \n we need to know your gender`}
      </Text>
      <CustomButton pressButton={onContinue}>Continue</CustomButton>
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
