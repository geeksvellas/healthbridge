import React, {useState} from 'react';
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
import Loader from './Loader';

const {width, height} = Dimensions.get('window');

export default function UsernameFill({navigation, route}) {
  const [uname, setuname] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const {name, gender} = route.params;
  const [loading, setloading] = useState(false);
  const {currentUser} = auth();
  // console.log(currentUser.uid, currentUser.phoneNumber);
  const onContinue = () => {
    if (uname) {
      setloading(true);
      firestore()
        .collection('username')
        .doc(uname)
        .get()
        .then(documentSnapshot => {
          setloading(false);
          if (documentSnapshot.exists) {
            setErrorMsg('username not available');
          } else {
            navigation.navigate('EmailFill', {
              name: name,
              gender: gender,
              uname: uname,
            });
          }
        });
      // navigation.replace('loggedInContainer');
    } else {
      setErrorMsg('Please provide an input');
    }
  };
  return (
    <View style={container}>
      <BackButton style={{width: width * 0.95}} />
      <Loader visible={loading} />

      <ProgressBar step={3} />
      <Text style={[medium, clickText, font15]}>Step 3/4</Text>
      <Text style={[bold, styles.heading, {paddingTop: 40}]}>
        {`Choose a preferred \n username`}
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
          autoFocus={true}
          style={[
            medium,
            font15,
            {padding: 10, textAlign: 'center', color: 'black'},
          ]}
          value={uname}
          placeholderTextColor="rgba(0,0,0,0.4)"
          onChangeText={value => {
            setErrorMsg('');
            setuname(value);
          }}
        />
      </View>
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
