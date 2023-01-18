import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {
  container,
  button,
  buttonText,
  medium,
  light,
  bold,
  font15,
  clickText,
} from './Styles';
import BackButton from './utilities/BackButton';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/functions';

import Loader from './Loader';
import CustomDialog from './utilities/CustomDialog';

const {width, height} = Dimensions.get('window');

export default function ShareAppointmentMember({route, navigation}) {
  const [appointData, setappointData] = useState([]);
  const [loading, setloading] = useState(true);
  const [loader, setloader] = useState(false);
  const [alertText, setalertText] = useState(null);
  const [alertVisible, setalertVisible] = useState(false);

  useEffect(() => {
    const {currentUser} = auth();
    const {val} = route.params;
    console.log(val);
    setloading(true);
    auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        firebase
          .app()
          .functions('asia-east2')
          .httpsCallable('getApprovedMembers?token=' + idToken)()
          .then(data => {
            var linkM = [];
            var aMem = [];
            console.log(data.data[0]);
            setappointData(data.data);
            setloading(false);
          })
          .catch(error => {
            setloading(false);

            console.log(error);
          });
      })
      .catch(err => {
        setloading(false);
        console.log(err);
      });
  }, []);

  const shareTo = value => {
    const {val} = route.params;
    console.log({
      appointmentId: val.id,
      memberId: value.uid,
    });
    var data = {
      appointmentId: val.id,
      memberId: value.uid,
    };
    if (val) {
      setloader(true);
      const {currentUser} = auth();
      auth()
        .currentUser.getIdToken(true)
        .then(function (idToken) {
          firebase
            .app()
            .functions('asia-east2')
            .httpsCallable('setSharedAppointment?token=' + idToken)(data)
            .then(response => {
              console.log(response);
              setloader(false);
              setalertText(
                'Appointment shared successfully with the selected user',
              );
              setTimeout(() => {
                setalertVisible(true);
              }, 500);
            })
            .catch(error => {
              setloader(false);
              console.log(error, 'Function error');
              if (
                error.message == 'Appointment already shared with selected user'
              ) {
                setalertText('Appointment already shared with selected user');
              } else {
                setalertText('Appointment sharing failed');
              }

              setTimeout(() => {
                setalertVisible(true);
              }, 500);
            });
        })
        .catch(error => {
          setloader(false);
          console.log(error, 'Auth Error');
        });
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor="#fff" />

      <View
        style={{
          justifyContent: 'center',
          backgroundColor: 'white',
          flex: 1,
        }}>
        <Loader visible={loader} />

        <ScrollView contentContainerStyle={{}}>
          <View style={{flexDirection: 'row', paddingVertical: 20}}>
            <BackButton />
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 20,
                alignItems: 'center',
              }}>
              <Text
                style={[
                  medium,
                  {fontSize: width / 25, paddingHorizontal: 20, color: 'black'},
                ]}>
                Select members
              </Text>
            </View>
          </View>
          {loading ? (
            <View style={{marginTop: 30}}>
              <Text style={[medium, {textAlign: 'center'}]}>
                Fetching members...
              </Text>
            </View>
          ) : appointData && appointData.length > 0 ? (
            <>
              {appointData.map((val, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      backgroundColor: '#f5f6fa',
                      padding: 20,
                      borderRadius: 16,
                      marginVertical: 10,
                      marginHorizontal: 20,
                      ...Platform.select({
                        ios: {
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2},
                          shadowOpacity: 0.8,
                          shadowRadius: 2,
                        },
                        android: {
                          elevation: 8,
                        },
                      }),
                    }}
                    onPress={() => shareTo(val)}>
                    <Image
                      style={{width: 50, height: 50}}
                      source={
                        val.body.gender
                          ? val.body.gender == 'male'
                            ? require('../assets/icons/gender/male.png')
                            : require('../assets/icons/gender/female.png')
                          : require('../assets/defaultAvatar.png')
                      }
                    />
                    <View style={{marginLeft: 20, flex: 1}}>
                      <Text style={[medium, {fontSize: width / 16}]}>
                        {val.body.fname + ' ' + val.body.lname}
                      </Text>
                      <Text style={[medium]}>{val.body.phone}</Text>
                      {val.nickname !== '' && (
                        <Text style={[medium]}>{val.nickname}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          ) : (
            <View style={{marginTop: 30}}>
              <Text style={[medium, {textAlign: 'center'}]}>
                You do not have any members
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
      <CustomDialog
        visible={alertVisible}
        message={alertText}
        buttonText1="Ok"
        onpressButton1={() => {
          setalertVisible(false);
          navigation.navigate('Home');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
