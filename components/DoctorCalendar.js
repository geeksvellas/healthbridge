import React, {useState, useEffect} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import BackButton from './utilities/BackButton';
import {medium, bold, light, button} from './Styles';
import {Calendar} from 'react-native-calendars';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import CustomButton from './CustomButton';
import Payment from './Payment';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Loader from './Loader';
import CustomDialog from './utilities/CustomDialog';
import {getUserProfile, setUserProfile} from './functions/Details';
import {firebase} from '@react-native-firebase/functions';
import {SafeAreaView} from 'react-native-safe-area-context';
import ReadMore from 'react-native-read-more-text';

const {width, height} = Dimensions.get('window');

export default function DoctorCalendar({route, navigation}) {
  const {id} = route.params;
  const currDate = new Date();
  const [selected, setSelected] = useState(null);
  const [amount, setamount] = useState(0);
  const [cardVisible, setcardVisible] = useState(false);
  const [doctor, setdoctor] = useState(null);
  const [timeSlots, settimeslots] = useState({});
  const [loading, setloading] = useState(false);
  const [selectedTime, setselectedTime] = useState([]);
  const [alertVisible, setalertVisible] = useState(false);
  const [alertText, setalertText] = useState(null);
  const [alertVisible1, setalertVisible1] = useState(false);
  const [alertText1, setalertText1] = useState(null);
  const [button1text, setbutton1text] = useState(null);
  const [button2text, setbutton2text] = useState(null);
  const [user, setUser] = useState(null);
  const [defaulC, setDefaultC] = useState(null);

  //   const time
  const _renderTruncatedFooter = handlePress => {
    return (
      <Text style={{color: '#54D9D5', paddingTop: 5}} onPress={handlePress}>
        Read more
      </Text>
    );
  };

  const _renderRevealedFooter = handlePress => {
    return (
      <Text style={{color: '#54D9D5', paddingTop: 5}} onPress={handlePress}>
        Show less
      </Text>
    );
  };
  const onBook = () => {
    setloading(true);
    const {currentUser} = auth();

    firestore()
      .collection('patient')
      .doc(currentUser.uid)
      .get()
      .then(documentSnapshot => {
        // console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists) {
          setloading(false);
          var userData = user;
          userData.status = documentSnapshot.data().status;
          setUser(userData);
          setUserProfile(userData);
          if (userData.status == 1) {
            if (selectedTime.length > 0 && selected) {
              // setloading(true);
              console.log(
                parseInt(doctor.rate[timeSlots.duration]) * selectedTime.length,
              );
              var am =
                parseInt(doctor.rate[timeSlots.duration]) * selectedTime.length;
              setamount(am);
              setTimeout(() => {
                setcardVisible(true);
                // confirmPayment({amount: amount, id: 'testid'});
              }, 500);
            } else {
              setalertText('Kindly select both date and time of appontment');
              setTimeout(() => {
                setalertVisible(true);
              }, 500);
            }
          } else if (userData.status == 2) {
            setbutton1text('Ok');
            setbutton2text(null);
            setalertVisible1(true);
            setalertText1(
              'Your profile is still under verification. Kindly be patient.',
            );
          } else {
            setbutton1text('Proceed to verify');
            setbutton2text('Later');
            setalertVisible1(true);
            setalertText1('Kindly verify your Profile to use this feature');
          }
        }
      });
  };

  const checkStatusAndNavigate = page => {};

  const onSuccesPayment = () => {
    setalertVisible(false);
    navigation.navigate('Telemedicine');
  };
  const getHours = slot => {
    var min = slot.split('-').join(':').split(':');
    var diff = Math.abs(parseInt(min[1]) - parseInt(min[3]));
    if (diff == 0) {
      return 'hour';
    } else if (diff == 30) {
      return '30Mins';
    } else {
      return '15Mins';
    }
  };
  const confirmPayment = paymentDetails => {
    setloading(true);
    const {currentUser} = auth();
    var amountT =
      parseInt(doctor.rate[timeSlots.duration]) * selectedTime.length;
    console.log(amountT, 'amount');
    var timeS =
      selectedTime[0].split('-')[0] +
      '-' +
      selectedTime[selectedTime.length - 1].split('-')[1];
    auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        firebase
          .app()
          .functions('asia-east2')
          .httpsCallable('SaveAppointmentData?token=' + idToken)({
            patientID: currentUser.uid,
            body: {
              age: user.dob
                ? Math.abs(
                    new Date(user.dob).getFullYear() - new Date().getFullYear(),
                  )
                : null,
              gender: user.gender,
              name: user.fname + ' ' + user.lname,
            },
            appointmentDate: new Date(selected).getDate(),
            appointmentMonth: new Date(selected).getMonth() + 1,
            appointmentYear: new Date(selected).getFullYear(),
            appointmentTime: timeS,
            appointmentDateObject: selected,
            docID: id,
            docName:
              doctor['firstname'].charAt(0).toUpperCase() +
              doctor['firstname'].slice(1) +
              ' ' +
              doctor['lastname'].charAt(0).toUpperCase() +
              doctor['lastname'].slice(1),
            status: 0,
            docEmail: doctor.email,
            amount: amountT,
            transactionID: paymentDetails.id,
            startTime: null,
            EndTime: null,
            appointmentURL: null,
            createdat: new Date().toDateString(),
          })
          .then(response => {
            var fullCal = [...timeSlots.timeslots];
            fullCal.forEach((val, index) => {
              if (selectedTime.indexOf(val.slot) !== -1) {
                fullCal[index].status = true;
              }
            });

            firestore()
              .collection('DoctorPublic')
              .doc(id)
              .collection('DoctorCalendar')
              .doc(selected)
              .set(
                {
                  duration: getHours(selectedTime[0]),
                  timeslots: fullCal,
                },
                {merge: true},
              )
              .then(() => {
                setloading(false);
                setalertText('Successfully booked an appointment');
                setTimeout(() => {
                  setalertVisible(true);
                }, 500);
              })
              .catch(error => {
                setloading(false);
                setTimeout(() => {
                  setalertVisible(true);
                }, 500);
                setalertText('Error in booking appointment');
              });
          })
          .catch(error => {
            console.log(error);
            setloading(false);
          });
      })
      .catch(err => {
        setloading(false);
        console.log(err);
      });
  };
  const setSelection = time => {
    console.log(selectedTime);
    console.log(time);
    if (
      selectedTime[0] == time ||
      selectedTime[selectedTime.length - 1] == time
    ) {
      setselectedTime(
        selectedTime.filter(function (value, index, arr) {
          return value != time;
        }),
      );
    } else {
      if (selectedTime.length > 0) {
        if (
          selectedTime[selectedTime.length - 1].split('-')[1] ==
          time.split('-')[0]
        ) {
          setselectedTime(oldArray => [...oldArray, time]);
        }
      } else {
        setselectedTime([time]);
      }
    }
  };
  const onDayPress = day => {
    setSelected(day.dateString);
    setselectedTime([]);
    console.log(day.dateString);
    firestore()
      .collection('DoctorPublic')
      .doc(id)
      .collection('DoctorCalendar')
      .doc(day.dateString)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        settimeslots([]);
        if (documentSnapshot.exists) {
          var currTime = documentSnapshot.data();
          settimeslots(currTime);
        } else {
          settimeslots(defaulC);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getTimeSlot = time => {
    // console.log(selected);
  };

  useEffect(() => {
    var data = getUserProfile();
    // setloading(false);
    setUser(data);
    firestore()
      .collection('DoctorPublic')
      .doc(id)
      .get()
      .then(documentSnapshot => {
        // console.log('User exists: ', documentSnapshot.data());
        if (documentSnapshot.exists) {
          setdoctor(documentSnapshot.data());
          firestore()
            .collection('DoctorPublic')
            .doc(id)
            .collection('DoctorCalendar')
            .doc('DefaultCalendar')
            .get()
            .then(documentSnapshot => {
              // console.log('User exists: ', documentSnapshot.exists);

              if (documentSnapshot.exists) {
                // console.log('User exists: ', documentSnapshot.data());
                setDefaultC(documentSnapshot.data());
              } else {
                setDefaultC([]);
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  return (
    <SafeAreaView style={{backgroundColor: '#F4F6FA', flex: 1}}>
      <Loader visible={loading} />
      {doctor && (
        <View style={{flex: 1}}>
          <BackButton style={{position: 'absolute', zIndex: 1}} />
          <Image
            style={{
              height: 255,
              position: 'absolute',
              zIndex: -1,
            }}
            width="100%"
            source={
              doctor.img ? {uri: doctor.img} : require('../assets/doctor.png')
            }
          />
          <ScrollView style={{flex: 1}}>
            <View
              style={{
                padding: 20,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                backgroundColor: 'white',
                marginTop: 250,
                flex: 1,
                zIndex: 2,
              }}>
              <Text style={[bold, {fontSize: width / 20, paddingVertical: 10}]}>
                {doctor.title ? doctor.title + ' ' : null}
                {doctor['firstname'].charAt(0).toUpperCase() +
                  doctor['firstname'].slice(1) +
                  ' ' +
                  doctor['lastname'].charAt(0).toUpperCase() +
                  doctor['lastname'].slice(1)}
              </Text>
              {doctor.speciality != '' && (
                <Text style={[medium, {paddingBottom: 10}]}>
                  {Array.isArray(doctor.speciality)
                    ? doctor.speciality
                        .map(word =>
                          word.replace(
                            word[0],
                            word[0].toString().toUpperCase(),
                          ),
                        )
                        .join(',')
                    : doctor.speciality}
                </Text>
              )}
              {doctor.oaddress != '' && (
                <Text style={[light, {paddingBottom: 10}]}>
                  {doctor.oaddress}
                </Text>
              )}
              {doctor.bio && (
                <ReadMore
                  numberOfLines={5}
                  renderTruncatedFooter={_renderTruncatedFooter}
                  renderRevealedFooter={_renderRevealedFooter}>
                  <Text style={[light, {paddingBottom: 10}]}>{doctor.bio}</Text>
                </ReadMore>
              )}

              <Text style={[medium, {paddingBottom: 10, paddingTop: 20}]}>
                Appointment date
              </Text>

              <Calendar
                style={{paddingBottom: 30}}
                current={selected ? new Date(selected) : currDate}
                minDate={currDate}
                monthFormat={'dd MMM yyyy'}
                onMonthChange={month => {
                  console.log('month changed', month);
                }}
                renderArrow={direction =>
                  direction == 'left' ? (
                    <Icon name="caretleft" color="#54D9D5" />
                  ) : (
                    <Icon name="caretright" color="#54D9D5" />
                  )
                }
                disableAllTouchEventsForDisabledDays={true}
                hideExtraDays={true}
                enableSwipeMonths={true}
                horizontal={true}
                onDayPress={onDayPress}
                markedDates={{
                  [selected]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: '#54D9D5',
                    selectedTextColor: 'white',
                  },
                }}
              />
              <Text style={[medium, {paddingBottom: 10}]}>
                Appointment time
              </Text>

              {timeSlots.timeslots && timeSlots.timeslots.length > 0 ? (
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}>
                  {timeSlots.timeslots.map((time, index) => {
                    if (time.status == false) {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={{
                            width: '30%',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            borderRadius: 10,
                            borderTopRightRadius: 10,
                          }}
                          onPress={() => setSelection(time.slot)}>
                          <Text
                            style={[
                              light,
                              {
                                color:
                                  selectedTime.indexOf(time.slot) != -1
                                    ? 'white'
                                    : '#7265E3',
                                backgroundColor:
                                  selectedTime.indexOf(time.slot) != -1
                                    ? '#54D9D5'
                                    : '#E4DFFF',
                                padding: 10,
                                borderRadius: 10,
                                borderTopRightRadius: 10,
                                textAlign: 'center',
                                flex: 1,
                                margin: 5,
                              },
                            ]}>
                            {time.slot}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  })}
                </View>
              ) : (
                <Text style={{textAlign: 'center', flex: 1}}>
                  No available time slots
                </Text>
              )}
              <View style={{alignItems: 'center'}}>
                <CustomButton pressButton={onBook}>
                  Book Appointment
                </CustomButton>
              </View>
            </View>
          </ScrollView>
          <CustomDialog
            visible={alertVisible}
            message={alertText}
            buttonText1="Ok"
            onpressButton1={() => {
              setalertVisible(false);
              navigation.pop();
            }}
          />
          <CustomDialog
            visible={alertVisible1}
            message={alertText1}
            buttonText1={button1text}
            buttonText2={button2text}
            onpressButton1={() => {
              setalertVisible1(false);
              if (user.status == 0) {
                navigation.navigate('EditProfile');
              }
            }}
            onpressButton2={() => setalertVisible1(false)}
          />
          <Payment
            onStartLoading={() => setloading(true)}
            onConfirmPayment={confirmPayment}
            cardVisible={cardVisible}
            amount={amount}
            setModalVisible={() => {
              setloading(false);
              setcardVisible(false);
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
