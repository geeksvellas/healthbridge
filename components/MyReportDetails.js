import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  Dimensions,
  TextInput,
  Platform,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
} from 'react-native';
import BackButton from './utilities/BackButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {medium, clickText, bold, font15, light} from './Styles';
import {firebase} from '@react-native-firebase/functions';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import CustomDialog from './utilities/CustomDialog';
import Loader from './Loader';

const {width, height} = Dimensions.get('window');
export default function MyReportDetails({route, navigation}) {
  const {value, isOwner} = route.params;
  // console.log(value);
  // const [results, setresults] = useState(value.testResults);
  const [reports, setreports] = useState(value.file);
  const [alertText1, setalertText1] = useState(null);
  const [alertText, setalertText] = useState(null);
  const [alertVisible1, setalertVisible1] = useState(false);
  const [alertVisible, setalertVisible] = useState(false);
  const [shareVisible, setshareVisible] = useState(false);
  const [downloaded, setdownloaded] = useState(false);
  const [loading, setloading] = useState(false);

  const viewFile = () => {
    const DownloadDir =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir + '/HealthDoc';
    var pdfLocation = DownloadDir + '/' + reports.fileName;
    if (Platform.OS === 'ios') {
      RNFetchBlob.ios.openDocument(pdfLocation);
    } else {
      RNFetchBlob.android.actionViewIntent(pdfLocation, reports.fileType);
    }
  };

  const saveFile = () => {
    const DownloadDir =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir + '/HealthDoc';
    var pdfLocation = DownloadDir + '/' + reports.fileName;
    console.log(pdfLocation);
    RNFetchBlob.fs
      .isDir(DownloadDir)
      .then(isDir => {
        if (isDir) {
          console.log('iSDir');
          RNFetchBlob.fs
            .writeFile(pdfLocation, reports.file, 'base64')
            .then(res => {
              console.log('saved');
              // Platform.OS == 'ios'
              //   ? setalertText('Document has been saved successfully')
              //   : setalertText('Document has been saved in Downloads folder');
              // setTimeout(() => {
              //   setalertVisible(true);
              // }, 500);
              setdownloaded(true);
            })
            .catch(err => {
              console.log('is Not dir1', err);
              setalertText(JSON.stringify(err));
              setTimeout(() => {
                setalertVisible(true);
              }, 500);
            });
        } else {
          RNFetchBlob.fs
            .mkdir(DownloadDir)
            .then(() => {
              console.log('Created Folder');
              RNFetchBlob.fs
                .writeFile(pdfLocation, reports.file, 'base64')
                .then(res => {
                  console.log('saved');
                  // Platform.OS == 'ios'
                  //   ? setalertText('Document has been saved successfully')
                  //   : setalertText(
                  //       'Document has been saved in Downloads folder',
                  //     );
                  // setTimeout(() => {
                  //   setalertVisible(true);
                  // }, 500);
                  setdownloaded(true);
                })
                .catch(err => {
                  console.log('is Not dir2', err);
                  setalertText(JSON.stringify(err));
                  setTimeout(() => {
                    setalertVisible(true);
                  }, 500);
                });
            })
            .catch(err => {
              console.log('is Not dir', err);
              setalertText(JSON.stringify(err));
              setTimeout(() => {
                setalertVisible(true);
              }, 500);
            });
        }
      })
      .catch(err => {
        setalertText(JSON.stringify(err));
        setTimeout(() => {
          setalertVisible(true);
        }, 500);
      });
  };

  const onShare = () => {
    navigation.navigate('ShareTo', {value: value});
    // navigation.navigate('AppointmentsModal', {value: value});
  };

  const unshare = () => {
    navigation.navigate('UnshareTo', {value: value});
    // navigation.navigate('AppointmentsModal', {value: value});
  };
  const onDelete = () => {
    console.log(value.id);
    console.log(value.body.reportURL.split('?alt=media')[0]);
    var fileurl = decodeURIComponent(
      value.body.reportURL
        .split('?alt=media')[0]
        .split(
          'https://firebasestorage.googleapis.com/v0/b/healthbridgeprod.appspot.com/o/',
        )[1],
    );
    console.log(fileurl);
    const {currentUser} = auth();
    setTimeout(() => {
      setloading(true);
      auth()
        .currentUser.getIdToken(true)
        .then(function (idToken) {
          firebase
            .app()
            .functions('asia-east2')
            .httpsCallable('deleteReport?token=' + idToken)({
              reportID: value.id,
              reportUrl: fileurl,
            })
            .then(response => {
              console.log(response, 'success');
              setloading(false);
              setalertText('Report deleted');
              setTimeout(() => {
                setalertVisible(true);
              }, 500);
            })
            .catch(error => {
              setloading(false);
              console.log(error, 'Function error');
              setalertText('Report deletion unsuccessful');
              setTimeout(() => {
                setalertVisible(true);
              }, 500);
            });
        })
        .catch(error => {
          console.log(error, 'Error');
        });
    }, 500);
    // setTimeout(() => {
    //   setloading(true);
    //   firestore()
    //     .collection('reports')
    //     .doc(value.id)
    //     .delete()
    //     .then(val => {
    //       setloading(false);
    //       console.log('deleted', val);
    //       setalertText('Report deleted');
    //       setTimeout(() => {
    //         setalertVisible(true);
    //       }, 500);
    //     });
    // }, 500);
  };
  useEffect(() => {
    if (value.type !== 'manualPatient') {
      const {currentUser} = auth();
      console.log(value);
      auth()
        .currentUser.getIdToken(true)
        .then(function (idToken) {
          firebase
            .app()
            .functions('asia-east2')
            .httpsCallable('downloadReportFile?token=' + idToken)({
              patientID: currentUser.uid,
              reportURL: value.body.reportURL,
            })
            .then(response => {
              // console.log(response, 'file');
              setreports(response.data.data);
              var DownloadDir =
                Platform.OS == 'ios'
                  ? RNFetchBlob.fs.dirs.DocumentDir
                  : RNFetchBlob.fs.dirs.DownloadDir + '/HealthDoc';
              var pdfLocation = DownloadDir + '/' + response.data.data.fileName;
              RNFetchBlob.fs
                .exists(pdfLocation)
                .then(exist => {
                  setdownloaded(exist);
                  console.log(`file ${exist ? '' : 'not'} exists`);
                })
                .catch(() => {});
            })
            .catch(error => {
              setreports({file: ''});
              console.log(error, 'Function error');
            });
        })
        .catch(error => {
          console.log(error, 'File upload');
        });
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={{backgroundColor: '#F4F6FA', flex: 1, paddingTop: 30}}>
      <StatusBar backgroundColor="#F4F6FA" />
      <Loader visible={loading} />
      <ScrollView>
        <View style={{flexDirection: 'row', paddingVertical: 20}}>
          <BackButton />
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 20,
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flex: 1,
              paddingEnd: 20,
            }}>
            <Text
              style={[
                medium,
                {fontSize: width / 15, paddingHorizontal: 20, color: 'black'},
              ]}>
              My Report
            </Text>
            <View style={{flexDirection: 'row'}}>
              {isOwner &&
              value.type !== 'docPatient' &&
              value.type == 'filePatient' ? (
                reports &&
                reports.file !== '' && (
                  <>
                    <TouchableOpacity
                      style={{marginHorizontal: 15}}
                      onPress={onShare}>
                      <Icon
                        style={{
                          borderRadius: 10,
                          padding: 9,
                          backgroundColor: '#54D9D5',
                          ...Platform.select({
                            ios: {
                              overflow: 'hidden',
                            },
                          }),
                        }}
                        name="share"
                        color="#fff"
                        size={20}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setalertVisible1(true)}>
                      <Icon
                        style={{
                          borderRadius: 10,
                          padding: 9,
                          backgroundColor: '#54D9D5',
                          ...Platform.select({
                            ios: {
                              overflow: 'hidden',
                            },
                          }),
                        }}
                        name="delete"
                        color="#fff"
                        size={20}
                      />
                    </TouchableOpacity>
                  </>
                )
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
        <View style={{marginHorizontal: 30}}>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              paddingLeft: 20,
              borderRadius: 16,
            }}>
            <Image
              source={require('../assets/labreport2.png')}
              style={{
                width: 100,
                height: 'auto',
              }}
              resizeMode="contain"
            />
            <View
              style={{
                flex: 1,
                justifyContent: 'space-between',
                paddingVertical: 10,
              }}>
              <View>
                <Text style={[{textAlign: 'left', color: '#000'}]}>
                  {value.body.clinicName}
                </Text>
                <Text
                  style={[
                    medium,
                    {paddingVertical: 5, textAlign: 'left', color: 'black'},
                  ]}>
                  {value.body.testName.charAt(0).toUpperCase() +
                    value.body.testName.slice(1)}
                </Text>
              </View>
              <Text
                style={[light, {textAlign: 'left', color: 'rgba(0,0,0,0.6)'}]}>
                {value.body.reportDateObject}
              </Text>
            </View>
          </View>
          <Text style={[medium, {marginTop: 30}]}>
            Laboratory Investigations Result
          </Text>
          {value.type !== 'manualPatient' ? (
            <>
              {reports ? (
                <>
                  {reports.file == '' ? (
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
                      <Text style={[medium, {flex: 1}]}>No file found</Text>
                    </View>
                  ) : (
                    <>
                      <View
                        style={{
                          backgroundColor: 'white',
                          borderRadius: 16,
                          padding: 20,

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
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text style={[medium, {flex: 1, paddingRight: 10}]}>
                            {reports.displayFileName
                              ? reports.displayFileName
                              : reports.fileName}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginTop: 10,
                          }}>
                          {downloaded == false ? (
                            <TouchableOpacity onPress={saveFile}>
                              <Icon
                                style={{
                                  borderRadius: 10,
                                  padding: 9,
                                  backgroundColor: '#54D9D5',
                                  ...Platform.select({
                                    ios: {
                                      overflow: 'hidden',
                                    },
                                  }),
                                }}
                                name="download"
                                color="#fff"
                                size={20}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={viewFile}>
                              <Icon
                                style={{
                                  borderRadius: 10,
                                  padding: 9,
                                  backgroundColor: '#54D9D5',
                                  ...Platform.select({
                                    ios: {
                                      overflow: 'hidden',
                                    },
                                  }),
                                }}
                                name="file-eye"
                                color="#fff"
                                size={20}
                              />
                            </TouchableOpacity>
                          )}
                          {value.type == 'filePatient' && (
                            <TouchableOpacity onPress={unshare}>
                              <Icon
                                style={{
                                  borderRadius: 10,
                                  padding: 9,
                                  marginLeft: 20,
                                  backgroundColor: '#54D9D5',
                                  ...Platform.select({
                                    ios: {
                                      overflow: 'hidden',
                                    },
                                  }),
                                }}
                                name="share-off"
                                color="#fff"
                                size={20}
                              />
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                      {/* <Image
                        source={{uri: `data:image/png;base64,${reports.file}`}}
                        style={{width: 200, height: 200}}
                      /> */}
                    </>
                  )}
                </>
              ) : (
                <Text
                  style={[
                    medium,
                    {textAlign: 'center', padding: 20, fontSize: width / 25},
                  ]}>
                  Loading File...
                </Text>
              )}
            </>
          ) : (
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 20,
                flexDirection: 'row',
                justifyContent: 'space-between',
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
              <Text style={[medium]}>
                {JSON.parse(value.body.testResults)
                  .name.charAt(0)
                  .toUpperCase() +
                  JSON.parse(value.body.testResults).name.slice(1)}
              </Text>
              <Text
                style={[
                  medium,
                  {
                    color: JSON.parse(value.body.testResults).indication
                      ? JSON.parse(value.body.testResults).indication == 1
                        ? 'red'
                        : 'green'
                      : 'black',
                  },
                ]}>
                {JSON.parse(value.body.testResults).value +
                  ' ' +
                  JSON.parse(value.body.testResults).unit}
              </Text>
            </View>
          )}
          {value.body.remarks && (
            <View>
              <Text
                style={[
                  medium,
                  {color: 'black', fontSize: width / 25, marginTop: 20},
                ]}>
                Remarks
              </Text>
              <Text
                style={[
                  light,
                  font15,
                  {
                    padding: 10,
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    marginVertical: 20,
                    minHeight: 100,
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
                  },
                ]}>
                {value.body.remarks}
              </Text>
            </View>
          )}
        </View>
        <CustomDialog
          visible={alertVisible}
          message={alertText}
          buttonText1="Ok"
          onpressButton1={() => navigation.navigate('ReportDash')}
          // onpressButton1={() => navigation.navigate('ReportDash')}
        />
        <CustomDialog
          visible={alertVisible1}
          message="Are you sure you want to delete this report?"
          buttonText1="Yes"
          buttonText2="No"
          onpressButton1={() => {
            setalertVisible1(false);
            onDelete();
          }}
          onpressButton2={() => setalertVisible1(false)}
        />
        <View style={{marginBottom: 100}}></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
