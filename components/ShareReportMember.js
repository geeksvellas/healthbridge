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

import firestore from '@react-native-firebase/firestore';
import Loader from './Loader';
import CustomDialog from './utilities/CustomDialog';

const {width, height} = Dimensions.get('window');

export default function ShareReportMember({route, navigation}) {
  const [appointData, setappointData] = useState([]);
  const [loading, setloading] = useState(true);
  const [loader, setloader] = useState(false);
  const [alertText, setalertText] = useState(null);
  const [alertVisible, setalertVisible] = useState(false);

  useEffect(() => {
    const {currentUser} = auth();
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
            // data.data.map(value => {
            //   setappointData(data.data);
            // });
            setloading(false);

            //   setlinkMembers(linkM);
            //   setmembers(aMem);
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
    // firestore()
    //   .collection('Appointments')
    //   .where('status', '<', 4)
    //   .where('patientID', '==', currentUser.uid)
    //   .get()
    //   .then(querySnapshot => {
    //     var aData = [];
    //     console.log(querySnapshot.size);
    //     querySnapshot.forEach(documentSnapshot => {
    //       var data = documentSnapshot.data();
    //       if ([0, 1, 3].indexOf(data.status) !== -1) {
    //         aData.push({
    //           docID: data.docID,
    //           docName: data.docName,
    //           appointmentID: documentSnapshot.id,
    //           appointmentTime: data.appointmentTime,
    //           appointmentDateObject: data.appointmentDateObject,
    //         });
    //       }
    //     });
    //     // console.log(aData);

    //     setappointData(aData);
    //     setloading(false);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
  }, []);

  const shareTo = val => {
    const {value} = route.params;
    console.log({
      patientID: value.patientID,
      docID: val.uid,
      reportID: value.id,
      body: value.body,
      type: value.type,
      createdBy: value.createdBy,
    });
    if (val) {
      setloader(true);
      const {currentUser} = auth();
      auth()
        .currentUser.getIdToken(true)
        .then(function (idToken) {
          firebase
            .app()
            .functions('asia-east2')
            .httpsCallable('shareReportTest?token=' + idToken)({
              patientID: value.patientID,
              famID: val.uid,
              reportID: value.id,
              body: value.body,
              type: value.type,
              createdBy: value.createdBy,
            })
            .then(response => {
              console.log(response);
              setloader(false);
              setalertText('Report shared successfully with the selected user');
              setTimeout(() => {
                setalertVisible(true);
              }, 500);
            })
            .catch(error => {
              setloader(false);
              console.log(error, 'Function error');
              if (error.message == 'Report already shared with selected user') {
                setalertText('Report already shared with selected user');
              } else {
                setalertText('Report sharing failed');
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
        onpressButton1={() => setalertVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
