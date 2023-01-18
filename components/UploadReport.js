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
  SafeAreaView,
  Alert,
  FlatList,
} from 'react-native';
import BackButton from './utilities/BackButton';
import AddTests from './AddTests';
import CustomButton from './CustomButton';
import {firebase} from '@react-native-firebase/functions';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import BottomTabNavigator from './utilities/BottomTabNavigator';
import DocumentPicker from 'react-native-document-picker';
import {medium, clickText, bold, font15, light} from './Styles';
import auth from '@react-native-firebase/auth';
import {launchImageLibrary} from 'react-native-image-picker';
// import {virgilCrypto} from 'react-native-virgil-crypto';
import DatePicker from 'react-native-datepicker';
import Loader from './Loader';
import RNFetchBlob from 'rn-fetch-blob';
import TestModal from './utilities/TestModal';
import CustomDialog from './utilities/CustomDialog';
import {getUserProfile} from './functions/Details';

const {width, height} = Dimensions.get('window');

export default function UploadReport({navigation}) {
  const [reports, setreports] = useState(null);
  const [establishment, setestablishment] = useState(null);
  const [testname, settestname] = useState(null);
  const [remarks, setremarks] = useState(null);
  const [loading, setloading] = useState(false);
  const [date, setDate] = useState(null);
  const [alertVisible, setalertVisible] = useState(false);
  const [alertText, setalertText] = useState(null);
  const [optionVisible, setoptionVisible] = useState(false);
  const [optionText, setoptionText] = useState(null);
  const [fileName, setfileName] = useState(null);
  const saveReport = () => {
    if (establishment && testname && date && reports) {
      setloading(true);
      const {currentUser} = auth();
      var userData = getUserProfile();
      console.log(
        fileName + reports.name.substring(reports.name.lastIndexOf('.')),
        'file namee going',
      );
      var rfileName = reports.name;
      if (fileName) {
        rfileName =
          fileName + reports.name.substring(reports.name.lastIndexOf('.'));
      }
      if (reports.base64) {
        // console.log(reports.base64, 'reports.base64');
        auth()
          .currentUser.getIdToken(true)
          .then(function (idToken) {
            firebase
              .app()
              .functions('asia-east2')
              .httpsCallable('UploadReport?token=' + idToken)({
                body: {
                  clinicName: establishment,
                  testName: testname.toLowerCase(),
                  reportDateObject: date.toDateString(),
                  remarks: remarks,
                  owner:
                    userData.fname.charAt(0).toUpperCase() +
                    userData.fname.slice(1) +
                    ' ' +
                    userData.lname.charAt(0).toUpperCase() +
                    userData.lname.slice(1),
                },
                fileBody: {
                  file: reports.base64,
                  fileName: rfileName,
                },
                patientID: currentUser.uid,
                createdBy: currentUser.uid,
                type: 'filePatient',
              })
              .then(response => {
                // console.log(response);
                setloading(false);
                setloading(false);
                setoptionText('Your report is successfully uploaded');
                // navigation.pop();
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
        if (Platform.OS === 'ios') {
          var filename = decodeURI(reports.uri.replace('file://', ''));
          // let arr = reports.uri.split('/');
          // const dirs = RNFetchBlob.fs.dirs;
          // var filename = `${dirs.DocumentDir}/${arr[arr.length - 1]}`;
        } else {
          var filename = reports.uri;
        }
        RNFetchBlob.fs
          .readFile(filename, 'base64')
          .then(encoded => {
            console.log(encoded, 'reports.base64');

            auth()
              .currentUser.getIdToken(true)
              .then(function (idToken) {
                firebase
                  .app()
                  .functions('asia-east2')
                  .httpsCallable('UploadReport?token=' + idToken)({
                    body: {
                      clinicName: establishment,
                      testName: testname.toLowerCase(),
                      reportDateObject: date.toDateString(),
                      remarks: remarks,
                    },
                    fileBody: {
                      file: encoded,
                      fileName: new Date().getTime() + '_' + rfileName,
                      displayFileName: rfileName,
                      fileType: reports.type,
                    },
                    patientID: currentUser.uid,
                    createdBy: currentUser.uid,
                    type: 'filePatient',
                  })
                  .then(response => {
                    console.log(response);
                    setloading(false);
                    setoptionText('Your report is successfully uploaded');
                    // navigation.pop();
                  })
                  .catch(error => {
                    setloading(false);
                    console.log(error.message, 'Function error found');
                    if (
                      error.message ==
                      'You have reached your limit. Kindly upgrade your membership to continue using this service.'
                    ) {
                      setoptionText(
                        'You have reached your limit. Kindly upgrade your membership to continue using this service.',
                      );
                    } else {
                      setoptionText(
                        'Something went wrong. Please contact admin.',
                      );
                    }
                  });
              })
              .catch(error => {
                setloading(false);
                console.log(error, 'Auth Error');
                setoptionText('Unable to fetch file. Please try again later');
              });
          })
          .catch(error => {
            setloading(false);
            console.log(error, 'File upload');
            setoptionText('Unable to fetch file. Please try again later');
          });
      }
    } else {
      setalertText('Fill all mandatory fields');
      setTimeout(() => {
        setalertVisible(true);
      }, 500);
    }
  };
  const onPressGallery = async () => {
    setoptionVisible(false);
    const res = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
      selectionLimit: 1,
    });
    // if (res.assets[0].fileSize < 1048487) {
    res.assets[0].name = res.assets[0].fileName;
    console.log(res.assets[0]);
    setreports(res.assets[0]);
    // } else {
    //   setalertText('File size larger than 1mb');
    //   setalertVisible(true);
    // }
  };
  const onPressDoc = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      setoptionVisible(false);
      setreports(res);

      console.log(res);
      // }
    } catch (err) {
      setloading(false);
      console.log(JSON.stringify(err), 'Errorss');
      setoptionText('Unable to fetch file. Please try again later');
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        // throw err;
      }
    }
  };
  const addTest = async () => {
    // settestModal(true);
    try {
      if (Platform.OS === 'ios') {
        setoptionVisible(true);
      } else {
        const res = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        });
        console.log(res);
        // if (res.size < 1048487) {
        setreports(res);
        // } else {
        //   setalertText('File size larger than 1mb');
        //   setalertVisible(true);
        // }
      }
    } catch (err) {
      // Alert.alert('Error', JSON.stringify(err));
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        // throw err;
      }
    }
  };
  const clearTest = () => {
    setreports(null);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                Upload Lab Report
              </Text>
            </View>
          </View>
          <Text style={[medium, {marginHorizontal: 30, color: 'white'}]}>
            Name of Test*
          </Text>
          <TextInput
            placeholder="Mention test name"
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={testname}
            onChangeText={text => settestname(text)}
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
                Lab Report
              </Text>
              {testname !== null && testname !== '' && (
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#54D9D5',
                      padding: 10,
                      paddingHorizontal: 20,
                      borderRadius: 16,
                    }}
                    onPress={addTest}>
                    <Text style={{color: 'white'}}>Add</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {reports ? (
              <View>
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 20,
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
                  <Text style={[medium, {flex: 1}]}>{reports.name}</Text>
                  <TouchableOpacity onPress={clearTest}>
                    <Icon name="close" size={30} color="#000" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  placeholder="Rename file (optional)"
                  value={fileName}
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  onChangeText={text => setfileName(text)}
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
                <Text
                  style={[
                    medium,
                    {color: 'black', fontSize: width / 25, marginTop: 20},
                  ]}>
                  Remarks
                </Text>
                <TextInput
                  placeholder="Enter your remarks"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  numberOfLines={5}
                  textAlignVertical="top"
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
                    Upload Report
                  </CustomButton>
                </View>
              </View>
            ) : (
              <Text
                style={[
                  light,
                  {textAlign: 'center', fontSize: width / 20, padding: 20},
                ]}>
                Add your test results
              </Text>
            )}
            <View style={{marginBottom: 100}}></View>
          </View>
        </ScrollView>
        <CustomDialog
          visible={alertVisible}
          message={alertText}
          buttonText1="Ok"
          onpressButton1={() => setalertVisible(false)}
        />
        <CustomDialog
          visible={optionText ? true : false}
          message={optionText}
          buttonText1="Ok"
          onpressButton1={() => {
            setoptionText(null);
            navigation.pop();
          }}
        />
        <CustomDialog
          visible={optionVisible}
          message="Select documents from"
          buttonText1="Gallery"
          buttonText2="Document"
          onpressButton1={onPressGallery}
          onpressButton2={onPressDoc}
        />
        {/* <TestModal
        visible={testNameModal}
        tests={tests}
        onpressBack={() => settestNameModal(false)}
        onSelect={val => {
          settestname(val);
          settestNameModal(false);
        }}
      /> */}
        {/* <Modal
        onRequestClose={() => settestNameModal(false)}
        visible={testNameModal}
        transparent={true}
        animationType="slide">
        <View
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            justifyContent: 'center',
          }}>
          <FlatList
            data={tests}
            keyExtractor={item => item.id}
            contentContainerStyle={{
              justifyContent: 'center',
              paddingHorizontal: 20,
              flex: 1,
            }}
            renderItem={(items, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.itemStyle}
                  onPress={() => {
                    settestname(items.item);
                    settestNameModal(false);
                  }}>
                  <Text style={styles.itemText}>
                    {items.item.charAt(0).toUpperCase() + items.item.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
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
    flexDirection: 'row',
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
