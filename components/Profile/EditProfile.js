import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  Platform,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
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
  inputBox,
  errorText,
} from '../Styles';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import config from '../../config';
import firestore from '@react-native-firebase/firestore';
import BackButton from '../utilities/BackButton';
import CustomButton from '../CustomButton';
import Loader from '../Loader';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';
// import {medium, clickText, bold, errorText, light} from '../Styles';
import {setUserProfile} from '../functions/Details';
import CountryList from '../utilities/CountryList';
import CustomDialog from '../utilities/CustomDialog';
import {firebase} from '@react-native-firebase/functions';
import {useDarkMode} from 'react-native-dynamic';
const {width, height} = Dimensions.get('window');

export default function EditProfile({navigation}) {
  const isDarkMode = useDarkMode();
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(false);
  const [bio, setBio] = useState(null);
  const [addr, setaddr] = useState(null);
  const [pincode, setpincode] = useState(null);
  const [passport, setpassport] = useState(null);
  const [nationalid, setnationalid] = useState(null);
  // const [safepin, setsafepin] = useState(null);
  const [allergies, setallergies] = useState(null);
  const [medication, setmedication] = useState(null);
  const [weight, setweight] = useState(null);
  const [height, setheight] = useState(null);
  const [errorMsg, seterrorMsg] = useState('');
  const [date, setDate] = useState(null);
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [cc, setcc] = useState(null);
  const [alertVisible, setalertVisible] = useState(false);
  const [alertText, setalertText] = useState(null);
  const onSelectCC = item => {
    setccVisible(false);
    console.log(item.name);
    setcc(item);
  };
  const [ccVisible, setccVisible] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // console.log(currentDate);
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  useEffect(() => {
    setloading(true);

    console.log(isDarkMode, 'Darkmode');
    const {currentUser} = auth();
    auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        firebase
          .app()
          .functions('asia-east2')
          .httpsCallable('getPatientData?token=' + idToken)({
            patientID: currentUser.uid,
          })
          .then(response => {
            var data = response.data.data.body;
            data.id = response.data.data.id;
            data.status = response.data.data.status;
            data.member = response.data.data.member
              ? response.data.data.member
              : '';
            console.log(data, 'dataa');

            setUserProfile(data);
            setUser(data);
            setBio(data.bio);
            setheight(data.height);
            setweight(data.weight);
            setaddr(data.addr);
            setpincode(data.pincode);
            setpassport(data.passport);
            setnationalid(data.nationalid);
            setallergies(data.allergies);
            setmedication(data.medication);
            setcc(data.nationality);
            setDate(data.dob ? new Date(data.dob) : null);
            setloading(false);
          })
          .catch(error => {
            setloading(false);
            console.log(error, 'Function error');
          });
      })
      .catch(err => {
        setloading(false);
        console.log(err);
      });

    // console.log(data);
    //     data.id = response.data.data.id;
    //     data.status = response.data.data.status;
    //     data.phone = currentUser.phoneNumber;

    // })
    // .catch(error => {
    //   console.log(error, 'Function error');
    // });
  }, []);
  const onUpdate = () => {
    const {currentUser} = auth();
    // seterrorMsg('');
    if (user.status == 0) {
      const fieldArray = [
        addr,
        cc,
        pincode,
        allergies,
        medication,
        date,
        passport,
        nationalid,
      ];
      var completed = true;
      for (var i = 0; i < fieldArray.length; i++) {
        // console.log(fieldArray[i]);
        if (fieldArray[i] == null || fieldArray[i] == '') {
          completed = false;
          break;
        }
      }
      if (completed) {
        setloading(true);
        console.log(user);
        fetch('https://api2.platomedical.com/healthbridgeintl/patient', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: config.plato_api_key,
          },
          body: JSON.stringify({
            given_id: currentUser.uid,
            name: user.fname + ' ' + user.lname,
            dob: date,
            sex: user.gender == 'male' ? 'Male' : 'Female',
            nationality: cc.nationality,
            allergies_select: 'Yes',
            allergies: allergies,
            telephone: user.phone,
            alerts: medication,
            address: addr,
            postal: pincode,
            email: user.email,
            nric: passport,
            nric_type: 'Passport',
          }),
        })
          .then(response => response.json())
          .then(json => {
            console.log(json);
            auth()
              .currentUser.getIdToken(true)
              .then(function (idToken) {
                firebase
                  .app()
                  .functions('asia-east2')
                  .httpsCallable('SavePatientData?token=' + idToken)({
                    body: {
                      fname: user.fname,
                      lname: user.lname,
                      gender: user.gender,
                      phone: user.phone,
                      email: user.email,
                      member: user.member,
                      bio: bio ? bio : null,
                      weight: weight ? weight : null,
                      height: height ? height : null,
                      dob: date.toDateString(),
                      addr: addr,
                      pincode: pincode,
                      allergies: allergies,
                      medication: medication,
                      passport: passport,
                      nationality: cc.name,
                      plato_id: json._id,
                      nationalid: nationalid,
                    },
                    plato_id: json._id,
                    status: 2,
                    patientID: currentUser.uid,
                  })
                  .then(() => {
                    setloading(false);
                    var uData = {
                      fname: user.fname,
                      lname: user.lname,
                      gender: user.gender,
                      phone: user.phone,
                      email: user.email,
                      member: user.member,
                      bio: bio ? bio : null,
                      weight: weight ? weight : null,
                      height: height ? height : null,
                      dob: date.toDateString(),
                      addr: addr,
                      pincode: pincode,
                      allergies: allergies,
                      medication: medication,
                      passport: passport,
                      nationality: cc.name,
                      nationalid: nationalid,
                      plato_id: json._id,
                      status: 2,
                      id: currentUser.uid,
                    };
                    setUserProfile(uData);
                    navigation.pop();
                  })
                  .catch(error => {
                    console.log(error);
                    setloading(false);
                    setTimeout(() => {
                      setalertVisible(true);
                    }, 500);
                    setalertText('Error in updating your data');
                  });
              })
              .catch(err => {
                setloading(false);
                console.log(err);
              });
          })
          .catch(error => {
            console.log(error);
            setloading(false);
            setTimeout(() => {
              setalertVisible(true);
            }, 500);
            setalertText('Error in submitting your data');
          });
      } else {
        setTimeout(() => {
          setalertVisible(true);
        }, 500);
        setalertText('Please fill all the mandatory fields!');
      }
    } else if (user.status > 0) {
      const fieldArray = [
        addr,
        cc,
        pincode,
        allergies,
        medication,
        date,
        passport,
      ];
      var completed = true;
      for (var i = 0; i < fieldArray.length; i++) {
        // console.log(fieldArray[i]);
        if (fieldArray[i] == null || fieldArray[i] == '') {
          completed = false;
          break;
        }
      }
      if (completed) {
        setloading(true);
        fetch(
          'https://api2.platomedical.com/healthbridgeintl/patient/' +
            user.plato_id,
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: config.plato_api_key,
            },
            body: JSON.stringify({
              dob: date,
              nationality: cc.nationality,
              allergies_select: 'Yes',
              allergies: allergies,
              telephone: user.phone,
              alerts: medication,
              address: addr,
              postal: pincode,
              nric: passport,
              nric_type: 'Passport',
            }),
          },
        )
          .then(response => response.json())
          .then(json => {
            auth()
              .currentUser.getIdToken(true)
              .then(function (idToken) {
                firebase
                  .app()
                  .functions('asia-east2')
                  .httpsCallable('SavePatientData?token=' + idToken)({
                    body: {
                      fname: user.fname,
                      lname: user.lname,
                      gender: user.gender,
                      phone: user.phone,
                      email: user.email,
                      member: user.member,
                      bio: bio ? bio : null,
                      weight: weight ? weight : null,
                      height: height ? height : null,
                      dob: date.toDateString(),
                      addr: addr,
                      pincode: pincode,
                      allergies: allergies,
                      medication: medication,
                      passport: passport,
                      nationality: cc.name,
                      plato_id: user.plato_id,
                      nationalid: nationalid,
                    },
                    plato_id: user.plato_id,
                    status: user.status,
                    patientID: currentUser.uid,
                  })
                  .then(() => {
                    setloading(false);
                    var uData = {
                      fname: user.fname,
                      lname: user.lname,
                      gender: user.gender,
                      phone: user.phone,
                      email: user.email,
                      member: user.member,
                      bio: bio ? bio : null,
                      weight: weight ? weight : null,
                      height: height ? height : null,
                      dob: date.toDateString(),
                      addr: addr,
                      pincode: pincode,
                      allergies: allergies,
                      medication: medication,
                      passport: passport,
                      nationality: cc.name,
                      plato_id: user.plato_id,
                      nationalid: nationalid,
                      status: user.status,
                      id: currentUser.uid,
                    };
                    setUserProfile(uData);
                    navigation.pop();
                  })
                  .catch(error => {
                    console.log(error);
                    setloading(false);
                    setTimeout(() => {
                      setalertVisible(true);
                    }, 500);
                    setalertText('Error in updating your data');
                  });
              })
              .catch(err => {
                setloading(false);
                console.log(err);
              });
          })
          .catch(error => {
            console.log(error);
            setloading(false);
            setTimeout(() => {
              setalertVisible(true);
            }, 500);
            setalertText('Error in submitting your data');
          });
      } else {
        setTimeout(() => {
          setalertVisible(true);
        }, 500);
        setalertText('Please fill all the mandatory fields!');
      }
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{backgroundColor: '#F4F6FA', flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#F4F6FA" />
        <Loader visible={loading} />
        <ScrollView>
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
                Edit Profile
              </Text>
            </View>
          </View>

          {user && (
            <View style={{marginHorizontal: 30}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={
                    user.gender == 'male'
                      ? require('../../assets/icons/gender/male.png')
                      : require('../../assets/icons/gender/female.png')
                  }
                  style={{width: 100, height: 100, marginRight: 20}}
                />
                <View
                  style={{
                    paddingTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View>
                    <Text style={[bold, {fontSize: width / 15}]}>
                      {user.fname.charAt(0).toUpperCase() + user.fname.slice(1)}{' '}
                      {user.lname.charAt(0).toUpperCase() + user.lname.slice(1)}
                    </Text>
                    {/* <Text>{user.uname}</Text> */}
                    {/* <Text
                      style={[
                        clickText,
                        {fontWeight: '600', fontSize: width / 25},
                      ]}>
                      {user.member ? user.member.membershipType : 'BASIC'}
                      MEMBER
                    </Text> */}

                    {user.status == 1 ? (
                      <Text
                        style={[
                          {
                            fontWeight: '600',
                            fontSize: width / 25,
                            color: 'green',
                          },
                        ]}>
                        Verified
                      </Text>
                    ) : (
                      <Text
                        style={[
                          {
                            fontWeight: '600',
                            fontSize: width / 25,
                            color: 'red',
                          },
                        ]}>
                        Not verified
                      </Text>
                    )}
                  </View>
                </View>
              </View>
              <Text style={[errorText, {textAlign: 'center'}]}>{errorMsg}</Text>
              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                Name
              </Text>
              <Text
                style={[
                  light,
                  {
                    fontSize: width / 25,
                    padding: 15,
                    backgroundColor: '#a5a5a5',
                    color: 'white',
                    borderRadius: 16,
                    marginVertical: 10,
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 3},
                        shadowOpacity: 0.6,
                        shadowRadius: 2,
                        overflow: 'hidden',
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  },
                ]}>
                {user.fname.charAt(0).toUpperCase() + user.fname.slice(1)}{' '}
                {user.lname.charAt(0).toUpperCase() + user.lname.slice(1)}
              </Text>
              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                Email Address
              </Text>
              <Text
                style={[
                  light,
                  {
                    fontSize: width / 25,
                    padding: 15,
                    backgroundColor: '#a5a5a5',
                    color: 'white',
                    borderRadius: 16,
                    marginVertical: 10,
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        overflow: 'hidden',
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  },
                ]}>
                {user.email}
              </Text>
              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                Mobile Number
              </Text>
              <Text
                style={[
                  light,
                  {
                    fontSize: width / 25,
                    padding: 15,
                    backgroundColor: '#a5a5a5',
                    color: 'white',
                    borderRadius: 16,
                    marginVertical: 10,
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        overflow: 'hidden',
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  },
                ]}>
                {user.phone}
              </Text>
              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                Date of birth*
              </Text>
              <DatePicker
                style={[
                  bold,
                  {
                    width: '100%',
                    padding: 10,
                    backgroundColor: 'white',
                    borderRadius: 16,
                    marginVertical: 10,
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        overflow: 'hidden',
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  },
                ]}
                date={date}
                mode="date"
                useNativeDriver={true}
                placeholder="Select DOB"
                format="DD MMMM YYYY"
                maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                customStyles={{
                  placeholderText: {
                    color: 'rgba(0,0,0,0.4)',
                    fontSize: Dimensions.get('window').width / 24,
                    ...Platform.select({
                      ios: {
                        fontFamily: 'Trebuchet MS',
                      },
                      android: {
                        fontFamily: 'Rubik-Light',
                      },
                    }),
                  },
                  dateInput: {
                    alignItems: 'flex-start',
                    flex: 1,
                    paddingLeft: 10,
                    borderWidth: 0,
                    color: 'black',
                    ...Platform.select({
                      ios: {
                        fontFamily: 'Trebuchet MS',
                      },
                      android: {
                        fontFamily: 'Rubik-Light',
                      },
                    }),
                  },
                  dateText: {
                    fontSize: Dimensions.get('window').width / 24,
                    color: 'black',
                    ...Platform.select({
                      ios: {
                        fontFamily: 'Trebuchet MS',
                      },
                      android: {
                        fontFamily: 'Rubik-Light',
                      },
                    }),
                  },
                  btnTextConfirm: {
                    color: 'black',
                  },
                  btnTextCancel: {
                    color: 'black',
                  },
                  datePicker: {
                    color: 'white',
                    backgroundColor: '#54D9D5',
                  },
                  // ... You can check the source to find the other keys.
                }}
                onDateChange={date => {
                  setDate(new Date(date));
                  // this.changeValue('DOB', date);
                }}
              />
              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                Bio
              </Text>
              <TextInput
                placeholder="Write about yourself"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={bio}
                numberOfLines={2}
                onChangeText={text => setBio(text)}
                style={[
                  light,
                  {
                    textAlignVertical: 'top',
                    fontSize: width / 25,
                    padding: 15,
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginVertical: 10,
                    color: 'black',
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        overflow: 'hidden',
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  },
                ]}
              />

              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                Passport*
              </Text>
              <TextInput
                placeholder="Provide passport number"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={passport}
                onChangeText={text => setpassport(text)}
                style={[
                  light,
                  {
                    fontSize: width / 25,
                    padding: 15,
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginVertical: 10,
                    color: 'black',
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        overflow: 'hidden',
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  },
                ]}
              />
              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                National ID*
              </Text>
              <TextInput
                placeholder="Provide national id"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={nationalid}
                onChangeText={text => setnationalid(text)}
                style={[
                  light,
                  {
                    fontSize: width / 25,
                    padding: 15,
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginVertical: 10,
                    color: 'black',
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        overflow: 'hidden',
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  },
                ]}
              />
              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                Country*
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',

                  backgroundColor: '#fff',
                  borderRadius: 16,
                  marginVertical: 10,
                  color: 'black',
                  ...Platform.select({
                    ios: {
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      overflow: 'hidden',
                    },
                    android: {
                      elevation: 5,
                    },
                  }),
                }}
                onPress={() => setccVisible(true)}>
                <Text
                  style={[
                    light,
                    {padding: 15, paddingVertical: 20, fontSize: width / 25},
                  ]}>
                  {cc ? (cc.name ? cc.name : cc) : 'Select Country'}
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                Address*
              </Text>
              <TextInput
                placeholder="Enter address"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={addr}
                numberOfLines={3}
                onChangeText={text => setaddr(text)}
                style={[
                  light,
                  {
                    textAlignVertical: 'top',
                    fontSize: width / 25,
                    padding: 15,
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginVertical: 10,
                    color: 'black',
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        overflow: 'hidden',
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  },
                ]}
              />
              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                Postal Code*
              </Text>
              <TextInput
                placeholder="Enter postal code"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={pincode}
                onChangeText={text => setpincode(text)}
                style={[
                  light,
                  {
                    fontSize: width / 25,
                    padding: 15,
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginVertical: 10,
                    color: 'black',
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        overflow: 'hidden',
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  },
                ]}
              />
              {/* <Text
              style={[
                medium,
                {
                  marginLeft: 20,
                  color: 'black',
                  fontSize: width / 25,
                  marginTop: 20,
                },
              ]}>
              Secure PIN*
            </Text>
            <TextInput
              placeholder="Four digit pin"
              placeholderTextColor="rgba(0,0,0,0.4)"
              value={safepin}
              maxLength={4}
              onChangeText={text => setsafepin(text)}
              style={[
                light,
                {
                  fontSize: width / 25,
                  padding: 15,
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  marginVertical: 10,
                  color: 'black',
                  ...Platform.select({
                    ios: {
                      shadowColor: '#000',
                      shadowOffset: {width: 0, height: 2},
                      shadowOpacity: 0.8,
                      shadowRadius: 2,
                      overflow: 'hidden',
                    },
                    android: {
                      elevation: 5,
                    },
                  }),
                },
              ]}
            /> */}
              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                Allergies*
              </Text>
              <TextInput
                placeholder="Provide your allergies if any"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={allergies}
                numberOfLines={2}
                onChangeText={text => setallergies(text)}
                style={[
                  light,
                  {
                    textAlignVertical: 'top',
                    fontSize: width / 25,
                    padding: 15,
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginVertical: 10,
                    color: 'black',
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        overflow: 'hidden',
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  },
                ]}
              />
              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                Current medication*
              </Text>
              <TextInput
                placeholder="Provide your current medication if any"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={medication}
                numberOfLines={2}
                onChangeText={text => setmedication(text)}
                style={[
                  light,
                  {
                    textAlignVertical: 'top',
                    fontSize: width / 25,
                    padding: 15,
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginVertical: 10,
                    color: 'black',
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        overflow: 'hidden',
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  },
                ]}
              />

              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                Weight (kg)
              </Text>
              <TextInput
                placeholder="Enter weight in kg"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={weight}
                keyboardType="number-pad"
                onChangeText={text => setweight(text)}
                style={[
                  light,
                  {
                    fontSize: width / 25,
                    padding: 15,
                    color: 'black',
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginVertical: 10,
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        overflow: 'hidden',
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  },
                ]}
              />
              <Text
                style={[
                  medium,
                  {
                    marginLeft: 20,
                    color: 'black',
                    fontSize: width / 25,
                    marginTop: 20,
                  },
                ]}>
                Height (cm)
              </Text>
              <TextInput
                placeholder="Enter height in cm"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={height}
                keyboardType="number-pad"
                onChangeText={text => setheight(text)}
                style={[
                  light,
                  {
                    color: 'black',
                    fontSize: width / 25,
                    padding: 15,
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginVertical: 10,
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        overflow: 'hidden',
                      },
                      android: {
                        elevation: 5,
                      },
                    }),
                  },
                ]}
              />
              <View style={{alignItems: 'center', marginTop: 20}}>
                <CustomButton pressButton={onUpdate}>
                  {user.status == 0 ? 'Verify profile' : 'Update Profile'}
                </CustomButton>
              </View>
            </View>
          )}
          <CountryList
            showIcons={false}
            visible={ccVisible}
            onSelect={onSelectCC}
          />
          <CustomDialog
            visible={alertVisible}
            message={alertText}
            buttonText1="Ok"
            onpressButton1={() => setalertVisible(false)}
          />
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
