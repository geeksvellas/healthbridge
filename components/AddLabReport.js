import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Modal,
  SafeAreaView,
  FlatList,
} from 'react-native';
import BackButton from './utilities/BackButton';
import {firebase} from '@react-native-firebase/functions';
import AddTests from './AddTests';
import CustomButton from './CustomButton';
import BottomTabNavigator from './utilities/BottomTabNavigator';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import {medium, clickText, bold, font15, light} from './Styles';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Loader from './Loader';
import CustomDialog from './utilities/CustomDialog';
import TestModal from './utilities/TestModal';
import {getUserProfile} from './functions/Details';

const {width, height} = Dimensions.get('window');

export default function AddLabReport({navigation}) {
  const [results, setresults] = useState(null);
  const [loading, setloading] = useState(false);
  const [establishment, setestablishment] = useState(null);
  const [manualTestName, setmanualTestName] = useState(null);
  const [manualTestValue, setmanualTestValue] = useState(null);
  const [manualTestUnit, setmanualTestUnit] = useState(null);
  const [testname, settestname] = useState(null);
  const [remarks, setremarks] = useState(null);
  const [testModal, settestModal] = useState(false);
  const [testNameModal, settestNameModal] = useState(false);
  const [alertVisible, setalertVisible] = useState(false);
  const [date, setDate] = useState(null);
  const [tests, settests] = useState(null);
  const addTest = () => {
    settestModal(true);
  };
  const onAppendTest = (
    name,
    value,
    unit,
    indication,
    upperLimit,
    lowerLimit,
  ) => {
    settestModal(false);
    // console.log(name, value);
    setresults({
      name: name,
      value: value,
      unit: unit,
      indication: indication,
      limits: lowerLimit + ' ' + unit + ' - ' + upperLimit + ' ' + unit,
    });
  };
  const addManualTest = () => {
    if (manualTestName && manualTestValue && manualTestUnit) {
      setresults({
        name: manualTestName,
        value: manualTestValue,
        unit: manualTestUnit,
        limits: null,
      });
    } else {
      setTimeout(() => {
        setalertVisible(true);
      }, 500);
    }
  };
  const getTests = () => {
    setloading(true);
    firestore()
      .collection('Tests')
      .doc('AllCategories')
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          settests(documentSnapshot.data().value);
          // console.log(documentSnapshot.data().value);
          setTimeout(() => {
            setloading(false);
            settestNameModal(true);
          }, 500);
        }
      })
      .catch(error => {
        setloading(false);
        console.log(error);
      });
  };
  const saveReport = () => {
    if (establishment && testname && date && results) {
      setloading(true);
      const {currentUser} = auth();
      var userData = getUserProfile();
      auth()
        .currentUser.getIdToken(true)
        .then(function (idToken) {
          firebase
            .app()
            .functions('asia-east2')
            .httpsCallable('SaveReportFile?token=' + idToken)({
              body: {
                clinicName: establishment,
                testName: testname,
                reportDateObject: date.toDateString(),
                testResults: JSON.stringify(results),
                remarks: remarks,
                owner:
                  userData.fname.charAt(0).toUpperCase() +
                  userData.fname.slice(1) +
                  ' ' +
                  userData.lname.charAt(0).toUpperCase() +
                  userData.lname.slice(1),
              },
              patientID: currentUser.uid,
              createdBy: currentUser.uid,
              type: 'manualPatient',
            })
            .then(response => {
              console.log(response);
              setloading(false);
              navigation.pop();
            })
            .catch(error => {
              setloading(false);
              console.log(error, 'Function error');
            });
        })
        .catch(error => {
          setloading(false);
          console.log(error, 'Auth Error');
        });
    } else {
      setTimeout(() => {
        setalertVisible(true);
      }, 500);
    }
  };

  return (
    <KeyboardAvoidingView
      bbehavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{backgroundColor: '#54D9D5', flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar backgroundColor="#54D9D5" />
        <Loader visible={loading} />
        <ScrollView contentContainerStyle={{minHeight: height}}>
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
                  {fontSize: width / 25, paddingHorizontal: 20, color: 'white'},
                ]}>
                Add Lab Test Data
              </Text>
            </View>
          </View>
          <Text style={[medium, {marginHorizontal: 30, color: 'white'}]}>
            Name of Test*
          </Text>
          <TouchableOpacity
            onPress={getTests}
            style={{
              flexDirection: 'row',
              alignItems: 'center',

              backgroundColor: '#fff',
              borderRadius: 16,
              margin: 20,
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
            }}>
            <Text
              style={[
                medium,
                font15,
                {
                  padding: 20,
                  color: testname ? 'black' : 'rgba(0,0,0,0.4)',
                },
              ]}>
              {testname ? testname : 'Select Test'}
            </Text>
          </TouchableOpacity>
          <Text style={[medium, {marginHorizontal: 30, color: 'white'}]}>
            Name of Medical Establishment*
          </Text>
          <TextInput
            placeholder="Mention clinic name"
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={establishment}
            onChangeText={text => setestablishment(text)}
            style={[
              medium,
              font15,
              {
                padding: 20,
                backgroundColor: '#fff',
                borderRadius: 16,
                margin: 20,
                color: 'black',
              },
            ]}
          />
          <Text style={[medium, {marginHorizontal: 30, color: 'white'}]}>
            Date of Report*
          </Text>
          <View style={{flexDirection: 'row'}}>
            <DatePicker
              style={[
                medium,
                {
                  flex: 1,
                  padding: 20,
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  margin: 20,
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
              date={date}
              mode="date"
              useNativeDriver={true}
              placeholder="Select date of report"
              format="DD MMMM YYYY"
              maxDate={new Date()}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              showIcon={false}
              customStyles={{
                placeholderText: {
                  color: 'rgba(0,0,0,0.4)',
                  fontSize: 15,
                  ...Platform.select({
                    ios: {
                      fontFamily: 'Trebuchet MS',
                    },
                    android: {
                      fontFamily: 'Rubik-Medium',
                    },
                  }),
                },
                dateInput: {
                  alignItems: 'flex-start',
                  flex: 1,
                  borderWidth: 0,
                  color: 'black',
                  ...Platform.select({
                    ios: {
                      fontFamily: 'Trebuchet MS',
                    },
                    android: {
                      fontFamily: 'Rubik-Medium',
                    },
                  }),
                },
                dateText: {
                  fontSize: 15,
                  color: 'black',
                  ...Platform.select({
                    ios: {
                      fontFamily: 'Trebuchet MS',
                    },
                    android: {
                      fontFamily: 'Rubik-Medium',
                    },
                  }),
                },
                datePickerCon: {},
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
          </View>

          <View
            style={{
              backgroundColor: '#F4F6FA',
              flex: 1,
              padding: 30,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={[medium, {color: 'black', fontSize: width / 25}]}>
                Laboratory Investigations
              </Text>
              {/* {testname && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#E4DFFF',
                  padding: 10,
                  paddingHorizontal: 20,
                  borderRadius: 16,
                }}
                onPress={addTest}>
                <Text style={{color: '#7265E3'}}>Add</Text>
              </TouchableOpacity>
            )} */}
            </View>

            {testname !== null ? (
              <View>
                {results == null && (
                  <View>
                    <View>
                      <View style={{alignItems: 'center', marginTop: 20}}>
                        <CustomButton pressButton={addTest}>
                          Select Test
                        </CustomButton>
                      </View>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: width / 25,
                          marginBottom: 10,
                        }}>
                        Or
                      </Text>
                      <View
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          borderRadius: 16,
                          paddingVertical: 10,
                        }}>
                        <Text
                          style={[
                            medium,
                            {
                              textAlign: 'center',
                              marginHorizontal: 30,
                              color: 'black',
                              marginVertical: 10,
                              fontSize: width / 25,
                            },
                          ]}>
                          Enter manually
                        </Text>
                        <TextInput
                          placeholder="Enter test name"
                          placeholderTextColor="rgba(0,0,0,0.4)"
                          value={manualTestName}
                          onChangeText={text => setmanualTestName(text)}
                          style={[
                            medium,
                            font15,
                            {
                              padding: 10,
                              textAlign: 'center',
                              backgroundColor: '#fff',
                              borderRadius: 16,
                              margin: 20,
                              marginHorizontal: 30,
                              color: 'black',
                            },
                          ]}
                        />
                        <View
                          style={{flexDirection: 'row', marginHorizontal: 30}}>
                          <TextInput
                            placeholder="Enter test value"
                            placeholderTextColor="rgba(0,0,0,0.4)"
                            value={manualTestValue}
                            onChangeText={text => setmanualTestValue(text)}
                            style={[
                              medium,
                              font15,
                              {
                                padding: 10,
                                textAlign: 'center',
                                backgroundColor: '#fff',
                                borderRadius: 16,
                                color: 'black',
                                flex: 2,
                              },
                            ]}
                          />
                          <TextInput
                            placeholder="Enter unit"
                            placeholderTextColor="rgba(0,0,0,0.4)"
                            value={manualTestUnit}
                            onChangeText={text => setmanualTestUnit(text)}
                            style={[
                              medium,
                              font15,
                              {
                                padding: 10,
                                flex: 1,
                                textAlign: 'center',
                                backgroundColor: '#fff',
                                borderRadius: 16,
                                marginLeft: 5,
                                color: 'black',
                              },
                            ]}
                          />
                        </View>
                        <View style={{alignItems: 'center', marginTop: 20}}>
                          <CustomButton pressButton={addManualTest}>
                            Submit
                          </CustomButton>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <Text
                style={[
                  light,
                  {textAlign: 'center', fontSize: width / 20, padding: 40},
                ]}>
                Select a test to proceed
              </Text>
            )}
            {results !== null && (
              <View>
                {/* {results.map((value, index) => {
                return ( */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 20,
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      borderRadius: 16,
                      padding: 20,
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',

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
                    <Text style={[medium]}>
                      {results.name.charAt(0).toUpperCase() +
                        results.name.slice(1)}
                    </Text>
                    <Text
                      style={[
                        medium,
                        {
                          color: results.indication
                            ? results.indication == '1'
                              ? 'red'
                              : 'green'
                            : 'black',
                        },
                      ]}>
                      {results.value}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{alignItems: 'center'}}
                    onPress={() => setresults(null)}>
                    <Icon name="close" size={30} color="#000" />
                  </TouchableOpacity>
                </View>
                {/* );
              })} */}
                <Text
                  style={[
                    medium,
                    {color: 'black', fontSize: width / 25, marginTop: 20},
                  ]}>
                  Remarks (optional)
                </Text>
                <TextInput
                  placeholder="Enter your remarks"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  numberOfLines={5}
                  textAlignVertical="top"
                  value={remarks}
                  onChangeText={text => setremarks(text)}
                  multiline={true}
                  style={[
                    medium,
                    font15,
                    {
                      padding: 10,
                      backgroundColor: '#fff',
                      borderRadius: 16,
                      marginVertical: 20,
                      color: 'black',
                    },
                  ]}
                />
                <View style={{alignItems: 'center', marginTop: 20}}>
                  <CustomButton pressButton={saveReport}>
                    Save Report
                  </CustomButton>
                </View>
              </View>
            )}
            <View style={{marginBottom: 100}}></View>
          </View>
        </ScrollView>
        <CustomDialog
          visible={alertVisible}
          message="Please fill all mandatory fields"
          buttonText1="Ok"
          onpressButton1={() => setalertVisible(false)}
        />
        <Modal onRequestClose={() => settestModal(false)} visible={testModal}>
          <AddTests
            collectionName={testname}
            appendTest={onAppendTest}
            onClose={() => settestModal(false)}
          />
        </Modal>
        <TestModal
          visible={testNameModal}
          tests={tests}
          onpressBack={() => settestNameModal(false)}
          onSelect={val => {
            settestname(val);
            settestNameModal(false);
          }}
        />
        {/* <Modal
        onRequestClose={() => settestNameModal(false)}
        visible={testNameModal}
        transparent={true}>
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            paddingTop: 20,
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'red',
            }}>
            <Text>jhvhv</Text>
            {tests &&
              tests.map((val, index) => {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.itemStyle}
                    onPress={() => {
                      settestname(val);
                      settestNameModal(false);
                    }}>
                    <Text style={styles.itemText}>
                      {val.charAt(0).toUpperCase() + val.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            
          </View>
        </View>
      </Modal> */}
        <BottomTabNavigator />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    backgroundColor: 'white',
    margin: 5,
    padding: 20,
    borderRadius: 16,
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    ...Platform.select({
      ios: {
        fontFamily: 'Trebuchet MS',
      },
      android: {
        fontFamily: 'Rubik-Medium',
      },
    }),
    fontSize: width / 20,
    paddingHorizontal: 10,
  },
});
