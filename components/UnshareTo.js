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

export default function UnshareTo({route, navigation}) {
  const [doctorList, setdoctorList] = useState([]);
  const [loading, setloading] = useState(true);
  const [loader, setloader] = useState(false);
  const [alertText, setalertText] = useState(null);
  const [alertVisible, setalertVisible] = useState(false);

  useEffect(() => {
    const {currentUser} = auth();
    const {value} = route.params;
    console.log(value.shareWithID);
    // value.shareWithID = null;
    setloading(true);
    // setdoctorList([
    //   {
    //     docID: value.shareWithID[0],
    //     title: 'Dr.',
    //     firstname: 'Rudra',
    //     lastname: 'pandey',
    //   },
    // ]);
    if (value.shareWithID && value.shareWithID.length > 0) {
      firestore()
        .collection('DoctorPublic')
        .where('docID', 'in', value.shareWithID)
        .get()
        .then(querySnapshot => {
          var aData = [];
          console.log(querySnapshot.size);
          querySnapshot.forEach(documentSnapshot => {
            var data = documentSnapshot.data();
            aData.push(data);
          });
          console.log(aData);

          //   setdoctorList(aData);
          setloading(false);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      setloading(false);
    }
  }, []);

  const unshare = val => {
    const {value} = route.params;
    setloader(true);
    console.log(val);
    auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        firebase
          .app()
          .functions('asia-east2')
          .httpsCallable('unShareReport?token=' + idToken)({
            patientID: value.patientID,
            unshareID: val,
            reportID: value.id,
            body: value.body,
            type: value.type,
            createdBy: value.createdBy,
          })
          .then(response => {
            console.log(response, 'success');
            setloader(false);
            setalertText('Report unshared successfully');
            setTimeout(() => {
              setalertVisible(true);
            }, 500);
          })
          .catch(error => {
            setloader(false);
            setalertText('Report unshare unsuccessful');
            setTimeout(() => {
              setalertVisible(true);
            }, 500);
            console.log(error, 'Function error');
          });
      })
      .catch(error => {
        console.log(error, 'File upload');
      });
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
                Select doctors to unshare
              </Text>
            </View>
          </View>
          {loading ? (
            <View style={{marginTop: 10}}>
              <Text style={[medium, {textAlign: 'center'}]}>
                Fetching doctors you have shared with...
              </Text>
            </View>
          ) : doctorList && doctorList.length > 0 ? (
            <>
              {doctorList.map((val, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => unshare(val.docID)}
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      backgroundColor: 'white',
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
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                      }}>
                      <Text
                        style={[
                          bold,
                          {fontSize: width / 20, paddingVertical: 10},
                        ]}>
                        {val.title ? val.title + ' ' : null}
                        {val['firstname'].charAt(0).toUpperCase() +
                          val['firstname'].slice(1) +
                          ' ' +
                          val['lastname'].charAt(0).toUpperCase() +
                          val['lastname'].slice(1)}
                      </Text>
                      {/* <Icon name="calendar" size={30} color="#000" /> */}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          ) : (
            <View style={{marginTop: 30}}>
              <Text style={[medium, {textAlign: 'center'}]}>
                You have not shared this report with any doctor
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
          navigation.navigate('ReportDash');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
