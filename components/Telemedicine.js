import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  container,
  button,
  buttonText,
  medium,
  light,
  bold,
  font15,
  errorText,
} from './Styles';
import BackButton from './utilities/BackButton';
import MaterialTabs from 'react-native-material-tabs';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import IoniconIcon from 'react-native-vector-icons/dist/Ionicons';
import BottomTabNavigator from './utilities/BottomTabNavigator';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {setSubscriber, getUserProfile} from './functions/Details';
import CustomDialog from './utilities/CustomDialog';

const {width, height} = Dimensions.get('window');

export default function Telemedicine({navigation}) {
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [alertVisible, setalertVisible] = useState(false);
  const [loading, setloading] = useState(false);
  const [loadingShared, setloadingShared] = useState(true);
  const [appointToCancel, setappointToCancel] = useState(false);
  const [alertText, setalertText] = useState(
    'Are you sure you want to cancel this appointment?',
  );
  const [appointments, setappointments] = useState([]);
  const [sharedappointments, setsharedappointments] = useState([]);
  const [currentappointments, setcurrentappointments] = useState([]);
  useEffect(() => {
    const {currentUser} = auth();
    setloading(true);
    setUser(getUserProfile());
    setSubscriber(
      firestore()
        .collection('Appointments')
        .where('patientID', '==', currentUser.uid)
        // .orderBy('appointmentDateObject', 'desc')
        .onSnapshot(querySnapshot => {
          // console.log('Total users: ', querySnapshot.size);/
          var aAppointment = [];
          var aCAppointment = [];
          querySnapshot.forEach(documentSnapshot => {
            if (
              documentSnapshot.data().appointmentDate == new Date().getDate() &&
              documentSnapshot.data().appointmentMonth ==
                new Date().getMonth() + 1 &&
              documentSnapshot.data().appointmentYear ==
                new Date().getFullYear() &&
              [2, 4].indexOf(documentSnapshot.data().status) == -1
            ) {
              console.log(documentSnapshot.data().status, 'now');
              aCAppointment.push(documentSnapshot.data());
            }
            var objectData = documentSnapshot.data();
            objectData.id = documentSnapshot.id;
            aAppointment.push(objectData);
          });
          setappointments(aAppointment);
          setcurrentappointments(aCAppointment);
          setloading(false);
        }),
    );
    setSubscriber(
      firestore()
        .collection('Appointments')
        .where('sharedWithID', 'array-contains', currentUser.uid)
        // .orderBy('appointmentDateObject', 'desc')
        .onSnapshot(querySnapshot => {
          // console.log('Total users: ', querySnapshot.size);/
          var sAppointment = [];
          querySnapshot.forEach(documentSnapshot => {
            var objectData = documentSnapshot.data();
            sAppointment.push(objectData);
          });
          setsharedappointments(sAppointment);
          setloadingShared(false);
        }),
    );
  }, []);

  const onCancel = id => {
    setappointToCancel(id);
    setTimeout(() => {
      setalertVisible(true);
    }, 500);
  };
  const onChangeTab = index => {
    setSelectedTab(index);
  };
  const onCancelConfirm = () => {
    console.log(appointToCancel);
    const {currentUser} = auth();
    firestore()
      .collection('Appointments')
      .doc(appointToCancel)
      .update({
        status: 5,
      })
      .then(() => {
        // Alert.alert('Your appointment was cancelled');
      })
      .catch(error => {
        Alert.alert('Error in cancelling appointment');
      });
  };

  const convertStatus = status => {
    switch (status) {
      case 0:
        return 'Waiting Approval';
      case 1:
        return 'Upcoming';
      case 2:
        return 'Declined';
      case 3:
        return 'Started';
      case 4:
        return 'Completed';
      case 5:
        return 'Cancelled';
    }
  };

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
  return (
    <View style={{backgroundColor: '#F4F6FA', flex: 1}}>
      {/* <SafeAreaView style={{flex: 1}}> */}
      <StatusBar backgroundColor="#f3f6fa" barStyle="dark-content" />
      <BackButton />
      <View style={{padding: 20}}>
        <MaterialTabs
          items={['My Bookings', 'Shared with me']}
          selectedIndex={selectedTab}
          onChange={onChangeTab}
          barColor="#F4F6FA"
          indicatorColor="#54D9D5"
          activeTextColor="#54D9D5"
          inactiveTextColor="black"
          textStyle={[medium]}
        />
      </View>
      {selectedTab == 0 ? (
        loading ? (
          <View style={{marginTop: 30}}>
            <Text style={[medium, {textAlign: 'center'}]}>
              Fetching Appointments...
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{paddingHorizontal: 20}}
            showsVerticalScrollIndicator={false}>
            {appointments.length > 0 && (
              <View>
                {currentappointments.length > 0 && (
                  <>
                    <View
                      style={{
                        paddingTop: 10,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text style={[medium, {fontSize: width / 25}]}>
                        Don't forget
                      </Text>
                    </View>
                    {currentappointments.map((val, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 16,
                            marginVertical: 20,
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
                                {new Date(
                                  val.appointmentDateObject,
                                ).toDateString()}
                              </Text>
                              <Text style={medium}>
                                {tConvert(val.appointmentTime)}
                              </Text>
                              <Text style={light}>
                                {convertStatus(val.status)}
                              </Text>
                            </View>
                          </View>
                          {val.appointmentURL && val.status == 3 && (
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate('VideoAppointment', {
                                  channel: val.appointmentURL.channel,
                                  token: val.appointmentURL.token,
                                  startTime: val.startTime,
                                  endTime: val.appointmentTime,
                                })
                              }>
                              <IoniconIcon
                                name="ios-videocam"
                                size={40}
                                color="#54D9D5"
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    })}
                  </>
                )}
              </View>
            )}
            <View
              style={{
                paddingTop: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={[medium, {fontSize: width / 25, marginBottom: 10}]}>
                Record & History
              </Text>
            </View>
            {appointments.length > 0 ? (
              <View>
                {appointments.map((val, index) => {
                  return (
                    <View
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
                          <Text style={light}>{convertStatus(val.status)}</Text>
                          {[0, 1].indexOf(val.status) !== -1 && (
                            <TouchableOpacity onPress={() => onCancel(val.id)}>
                              <Text style={[light, errorText]}>
                                Cancel appointment
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                      <View style={{flexDirection: 'column'}}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('ShareAppointmentMember', {
                              val: val,
                            })
                          }>
                          <IoniconIcon
                            name="share-social-sharp"
                            size={20}
                            color="#54D9D5"
                          />
                        </TouchableOpacity>

                        {val.appointmentURL && val.status == 3 && (
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('VideoAppointment', {
                                channel: val.appointmentURL.channel,
                                token: val.appointmentURL.token,
                                startTime: val.startTime,
                                endTime: val.appointmentTime,
                                // endTime: '03:25',
                              })
                            }>
                            <IoniconIcon
                              name="ios-videocam"
                              size={40}
                              color="#54D9D5"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View>
                <Text
                  style={[medium, {textAlign: 'center', marginVertical: 30}]}>
                  No appointments yet
                </Text>
              </View>
            )}
            <View style={{marginBottom: 100}}></View>
          </ScrollView>
        )
      ) : loadingShared ? (
        <View style={{marginTop: 30}}>
          <Text style={[medium, {textAlign: 'center'}]}>
            Fetching shared appointments...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{paddingHorizontal: 20}}
          showsVerticalScrollIndicator={false}>
          {sharedappointments.length > 0 ? (
            <View>
              {sharedappointments.map((val, index) => {
                return (
                  <View
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
                        <Text style={light}>{convertStatus(val.status)}</Text>
                      </View>
                    </View>
                    {val.appointmentURL && val.status == 3 && (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('VideoAppointment', {
                            channel: val.appointmentURL.channel,
                            token: val.appointmentURL.token,
                            startTime: val.startTime,
                            endTime: val.appointmentTime,
                            // endTime: '03:25',
                          })
                        }>
                        <IoniconIcon
                          name="ios-videocam"
                          size={40}
                          color="#54D9D5"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          ) : (
            <View>
              <Text style={[medium, {textAlign: 'center', marginVertical: 30}]}>
                No appointments yet
              </Text>
            </View>
          )}
          <View style={{marginBottom: 100}}></View>
        </ScrollView>
      )}

      <BottomTabNavigator active="file-text" />
      <CustomDialog
        visible={alertVisible}
        message={alertText}
        buttonText1="Yes"
        buttonText2="No"
        onpressButton1={() => {
          onCancelConfirm();
          setalertVisible(false);
        }}
        onpressButton2={() => setalertVisible(false)}
      />
      {/* </SafeAreaView> */}
    </View>
  );
}

const styles = StyleSheet.create({});
