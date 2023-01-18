import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  TextInput,
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
  errorText,
} from './Styles';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import CustomButton from './CustomButton';
import ProgressBar from './utilities/ProgressBar';
const {width, height} = Dimensions.get('window');

export default function NameFill({navigation, route}) {
  const [fname, setfname] = useState('');
  const [lname, setlname] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const onContinue = () => {
    if (fname && lname) {
      navigation.navigate('GenderFill', {
        name: {fname: fname.toLowerCase(), lname: lname.toLowerCase()},
      });
    } else {
      setErrorMsg('Please fill the below details');
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={container}>
        {/* <BackButton style={{width: width * 0.95}}>
        <TouchableOpacity onPress={onContinue}>
          <Text>Skip</Text>
        </TouchableOpacity>
      </BackButton> */}
        <ProgressBar step={1} max={3} />
        <Text style={[medium, clickText, font15]}>Step 1/3</Text>
        <Text style={[bold, styles.heading, {paddingTop: 40}]}>
          {`Tell us, what is your \n name?`}
        </Text>
        <Text style={[light, {fontSize: width / 25}]}>
          Please choose your name wisely!
        </Text>
        <Text style={[errorText]}>{errorMsg}</Text>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 20,
            marginHorizontal: 20,
            backgroundColor: '#fff',
            borderRadius: 16,
            marginHorizontal: 40,
            padding: 10,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.8,
                shadowRadius: 2,
              },
              android: {
                elevation: 5,
              },
            }),
          }}>
          <TextInput
            autoFocus={true}
            style={[
              medium,
              font15,
              {
                flex: 1,
                textAlign: 'center',
                color: 'black',
              },
            ]}
            value={fname}
            onChangeText={value => setfname(value)}
            placeholder="First Name"
            placeholderTextColor="rgba(0,0,0,0.4)"
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginVertical: 20,
            marginHorizontal: 20,
            backgroundColor: '#fff',
            borderRadius: 16,
            marginHorizontal: 40,
            padding: 10,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.8,
                shadowRadius: 2,
              },
              android: {
                elevation: 5,
              },
            }),
          }}>
          <TextInput
            placeholder="Last Name"
            style={[
              medium,
              font15,
              {
                flex: 1,
                textAlign: 'center',
                color: 'black',
              },
            ]}
            value={lname}
            onChangeText={value => setlname(value)}
            placeholderTextColor="rgba(0,0,0,0.4)"
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
