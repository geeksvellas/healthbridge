import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Platform,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import Loader from '../Loader';
import {
  container,
  button,
  buttonText,
  medium,
  light,
  bold,
  errorText,
  font15,
} from '../Styles';
const {width, height} = Dimensions.get('window');
import CountryList from './CountryList';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/functions';
import {getUserProfile, signOutMain} from '../functions/Details';

export default function AddMemberModal({visible, onExit}) {
  const [number, setPNumber] = useState('');
  const [nickname, setnickname] = useState('');

  const [errorMsg, seterrorMsg] = useState(null);
  const [ccVisible, setccVisible] = useState(false);
  const [loading, setloading] = useState(false);

  const [cc, setcc] = useState({
    cc: '+65',
    icon: require('../../assets/icons/country/singapore.png'),
  });
  const onCancel = () => {
    setcc({
      cc: '+65',
      icon: require('../../assets/icons/country/singapore.png'),
    });
    setPNumber('');
    setnickname('');
    seterrorMsg('');
    onExit();
  };
  const onSubmit = () => {
    var profileData = getUserProfile();
    console.log(profileData);
    console.log(cc.cc + number);
    setloading(true);
    if (profileData.phone != cc.cc + number) {
      auth()
        .currentUser.getIdToken(true)
        .then(function (idToken) {
          firebase
            .app()
            .functions('asia-east2')
            .httpsCallable('onSendMemberReq?token=' + idToken)({
              phone: cc.cc + number,
              fname: profileData.fname,
              lname: profileData.lname,
              gender: profileData.gender,
              nickname: nickname ? nickname : '',
            })
            .then(() => {
              setloading(false);
              setcc({
                cc: '+65',
                icon: require('../../assets/icons/country/singapore.png'),
              });
              setPNumber('');
              setnickname('');
              seterrorMsg('');
              onExit();
              // navigation.pop();
            })
            .catch(error => {
              console.log(error);
              setloading(false);
              seterrorMsg('User not found');
            });
        })
        .catch(err => {
          setloading(false);
          console.log(err);
          seterrorMsg('Operation Failed. Try again');
        });
    } else {
      setloading(false);
      seterrorMsg('Sorry, you cannot add yourself.');
    }
  };
  const onSelectCC = item => {
    setccVisible(false);
    setcc(item);
  };
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <Loader visible={loading} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 10,
              width: width * 0.8,
            }}>
            <Text
              style={[
                bold,
                {
                  ...Platform.select({
                    ios: {
                      fontSize: width / 20,
                      fontWeight: 'bold',
                    },
                  }),
                },
              ]}>
              What's their mobile number?
            </Text>
            <Text
              style={[errorText, {textAlign: 'center', paddingVertical: 5}]}>
              {errorMsg}
            </Text>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 10,
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
                  {
                    flex: 1,
                    padding: 10,
                    color: 'black',
                    borderRadius: 3,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                  },
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
            <TextInput
              style={[
                medium,
                font15,
                {
                  borderRadius: 3,
                  padding: 10,
                  color: 'black',
                  marginBottom: 10,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                },
              ]}
              value={nickname}
              onChangeText={value => {
                seterrorMsg('');
                setnickname(value);
              }}
              placeholder="Enter nickname"
              placeholderTextColor="rgba(0,0,0,0.4)"
            />
            <View style={{alignItems: 'center', flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={onSubmit}
                style={{
                  padding: 10,
                  backgroundColor: '#54D9D5',
                  borderRadius: 10,
                  flex: 2,
                  marginRight: 10,
                }}>
                <Text style={[medium, {color: '#fff', textAlign: 'center'}]}>
                  Send invite
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onCancel}
                style={{
                  padding: 10,
                  flex: 1,
                }}>
                <Text style={[medium, {color: '#000', textAlign: 'center'}]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <CountryList
            showIcons={true}
            visible={ccVisible}
            onSelect={onSelectCC}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({});
