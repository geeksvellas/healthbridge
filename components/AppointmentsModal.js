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

export default function AppointmentsModal({route, navigation}) {
  const [appointData, setappointData] = useState([]);
  const [loading, setloading] = useState(true);
  const [loader, setloader] = useState(false);
  const [alertText, setalertText] = useState(null);
  const [alertVisible, setalertVisible] = useState(false);

  const tConvert = time => {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  };
  useEffect(() => {
    const {currentUser} = auth();

    setloading(true);
    firestore()
      .collection('Appointments')
      .where('status', '<', 4)
      .where('patientID', '==', currentUser.uid)
      .get()
      .then(querySnapshot => {
        var aData = [];
        console.log(querySnapshot.size);
        querySnapshot.forEach(documentSnapshot => {
          var data = documentSnapshot.data();
          if ([0, 1, 3].indexOf(data.status) !== -1) {
            aData.push({
              docID: data.docID,
              docName: data.docName,
              appointmentID: documentSnapshot.id,
              appointmentTime: data.appointmentTime,
              appointmentDateObject: data.appointmentDateObject,
            });
          }
        });
        // console.log(aData);

        setappointData(aData);
        setloading(false);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const shareTo = val => {
    const {value} = route.params;
    console.log({
      patientID: value.patientID,
      docID: val.docID,
      reportID: value.id,
      appointmentID: val.appointmentID,
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
              docID: val.docID,
              reportID: value.id,
              appointmentID: val.appointmentID,
              body: value.body,
              type: value.type,
              createdBy: value.createdBy,
            })
            .then(response => {
              console.log(response);
              setloader(false);
              setalertText('Report shared successfully');
              setTimeout(() => {
                setalertVisible(true);
              }, 500);
            })
            .catch(error => {
              setloader(false);
              console.log(error, 'Function error');
              if (error.message == 'Report already shared with selected user') {
                setalertText('Report already shared with the selected doctor');
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
                Select appointment
              </Text>
            </View>
          </View>
          {loading ? (
            <View style={{marginTop: 30}}>
              <Text style={[medium, {textAlign: 'center'}]}>
                Fetching appointments...
              </Text>
            </View>
          ) : appointData && appointData.length > 0 ? (
            <>
              {appointData.map((val, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => shareTo(val)}
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      backgroundColor: 'white',
                      padding: 20,
                      borderRadius: 16,
                      marginVertical: 10,
                      marginHorizontal: 10,
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
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      }}>
                      <Icon name="calendar" size={30} color="#000" />
                      <View style={{paddingHorizontal: 10}}>
                        <Text style={[medium]}>{val.docName}</Text>
                        <Text style={medium}>
                          {new Date(val.appointmentDateObject).toDateString()}
                        </Text>
                        <Text style={medium}>
                          {tConvert(val.appointmentTime.split('-')[0])}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          ) : (
            <View style={{marginTop: 30}}>
              <Text style={[medium, {textAlign: 'center'}]}>
                You do not have any appointments
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
