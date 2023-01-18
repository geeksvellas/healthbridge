import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Modal,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import BigTile from './utilities/BigTile';
import PushNotification, {Importance} from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import {
  requestMultiple,
  PERMISSIONS,
  checkMultiple,
} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import {medium, light, errorText} from './Styles';
import Tile from './utilities/Tile';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import BottomTabNavigator from './utilities/BottomTabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './Loader';
import {firebase} from '@react-native-firebase/functions';
import CustomDialog from './utilities/CustomDialog';
import {setSubscriber, setPin, setUserProfile} from './functions/Details';
import ImageCarousal from './utilities/ImageCarousal';
import VersionCheck from 'react-native-version-check';
import {
  requestUserPermission,
  notificationListener,
} from './utilities/NotificationService';
const {width, height} = Dimensions.get('window');

export default function Home({navigation}) {
  const [user, setUser] = useState(null);
  const [allPerm, setallPerm] = useState(0);
  // const [pinError, setpinError] = useState('');
  const [button1text, setbutton1text] = useState(null);
  const [button2text, setbutton2text] = useState(null);
  // const [safepin, setsafepin] = useState(null);
  const [loading, setloading] = useState(false);
  const [storeUrl, setstoreUrl] = useState(null);

  const [learningurl, setlearningurl] = useState(null);
  // const [inputPinVisible, setinputPinVisible] = useState(false);
  const [alertVisible, setalertVisible] = useState(false);
  const [updatePhoneVisible, setupdatePhoneVisible] = useState(false);

  const [subtext, setsubtext] = useState('');
  const [Banner, setBanner] = useState(null);
  const [alertText, setalertText] = useState(
    'Kindly verify your Profile to use this feature',
  );
  const encrypt = async () => {};
  const onImageClick = image => {
    if (image.type) {
      if (image.type === 'web') {
        Linking.openURL(image.to);
      } else {
        navigation.navigate(image.to);
      }
    }
  };
  const navFitness = async () => {
    setloading(true);
    try {
      const value = await AsyncStorage.getItem('@token');
      if (value !== null) {
        // navigation.navigate('Connect');

        var val = JSON.parse(value);

        fetch(
          'https://api.fitbit.com/1/user/' + val.user_id + '/profile.json',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${val.access_token}`,
            },
            // body: `root=auto&path=${Math.random()}`
          },
        )
          .then(res => res.json())
          .then(res => {
            console.log(res);
            if (res.success == false) {
              if (res.errors[0].errorType == 'expired_token') {
                // seterrorMsg(JSON.stringify(res));
                // connectFitbit();
                setloading(false);
                navigation.navigate('Disclaimer');
              } else {
                // /setloading(false);
                navigation.navigate('Disclaimer');
                setloading(false);
              }
            } else {
              setloading(false);
              navigation.navigate('Connect');
            }
          })
          .catch(err => {
            // seterrorMsg(JSON.stringify(err));
            setloading(false);
            console.log('Errorr: ', err);
          });
      } else {
        navigation.navigate('Disclaimer');
        setloading(false);
      }
    } catch (e) {
      navigation.navigate('Disclaimer');
      setloading(false);
    }
  };
  const body = () => {
    return (
      <View style={{flex: 1}}>
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1, paddingHorizontal: 20}}>
            <StatusBar backgroundColor="#a2e2e2" barStyle="dark-content" />
            <Loader visible={loading} />
            <View style={{position: 'absolute', height: height}}>
              <Image
                style={{width: width}}
                source={require('../assets/Fill8.png')}
                resizeMode="cover"
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingVertical: 20,
                alignItems: 'center',
              }}>
              {user && (
                <Image
                  source={
                    user.gender == 'male'
                      ? require('../assets/icons/gender/male.png')
                      : require('../assets/icons/gender/female.png')
                  }
                  style={{width: 60, height: 60}}
                />
              )}
              <View style={{padding: 10}}>
                {user && (
                  <Text style={[medium, {fontSize: width / 25}]}>
                    Hi,{' '}
                    {user.fname.charAt(0).toUpperCase() + user.fname.slice(1)}{' '}
                    {user.lname.charAt(0).toUpperCase() + user.lname.slice(1)}
                  </Text>
                )}
              </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={[medium, {fontSize: width / 25, paddingHorizontal: 10}]}>
                What are you looking for?
              </Text>
              <View style={{paddingHorizontal: 10}}>
                <View
                  style={{
                    // paddingHorizontal: 10,
                    paddingTop: 20,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: Platform.OS == 'ios' ? 0 : 10,
                  }}>
                  <BigTile
                    pic={require('../assets/Asset_37.png')}
                    pressButton={() => navigation.navigate('VConsultation')}
                    new={true}
                    style={{marginRight: 10}}
                  />
                  <BigTile
                    pic={require('../assets/Mask1.png')}
                    new={true}
                    pressButton={() => navigation.navigate('ReportDash')}
                  />
                </View>
                {/* <View style={{flexDirection: 'row'}}>
                  <BigTile
                    pic={require('../assets/Home_screen_fitbit.png')}
                    new={true}
                    pressButton={navFitness}
                    style={{paddingBottom: 20}}
                  />
                </View> */}
                <TouchableOpacity
                  style={{
                    height: (Dimensions.get('window').width - 40) * (5 / 16),
                    backgroundColor: '#dddfe0',
                    borderRadius: 10,
                    overflow: 'hidden',
                    marginVertical: 20,
                    ...Platform.select({
                      ios: {
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 2},
                        shadowOpacity: 0.8,
                        shadowRadius: 10,
                      },
                      android: {
                        elevation: 10,
                      },
                    }),
                  }}
                  onPress={navFitness}>
                  <Image
                    style={{
                      width: Dimensions.get('window').width - 40,
                      backgroundColor: 'white',
                      flex: 1,
                      resizeMode: 'cover',
                    }}
                    source={require('../assets/Asset_38.png')}
                  />
                </TouchableOpacity>
                {Banner && (
                  <View
                    style={{
                      height: (Dimensions.get('window').width - 40) * (5 / 16),
                      backgroundColor: '#dddfe0',
                      borderRadius: 10,
                      overflow: 'hidden',
                      ...Platform.select({
                        ios: {
                          shadowColor: '#000',
                          shadowOffset: {width: 0, height: 2},
                          shadowOpacity: 0.8,
                          shadowRadius: 10,
                        },
                        android: {
                          elevation: 10,
                        },
                      }),
                      // marginHorizontal: Platform.OS == 'ios' ? 10 : 20,
                    }}>
                    <ImageCarousal
                      imagePressed={image => onImageClick(image)}
                      textTitle={Banner}
                      navigation={navigation}
                    />
                  </View>
                )}
              </View>
              <View style={{marginBottom: 100}}></View>
            </ScrollView>
            <CustomDialog
              visible={alertVisible}
              message={alertText}
              buttonText1={button1text}
              buttonText2={button2text}
              onpressButton1={() => {
                setalertVisible(false);
                if (user.status == 0) {
                  navigation.navigate('EditProfile');
                }
              }}
              onpressButton2={() => setalertVisible(false)}
            />
          </View>
          <BottomTabNavigator active="home" />
        </SafeAreaView>
      </View>
    );
  };

  // const LocalNotification = () => {
  //   PushNotification.localNotification({
  //     channelId: 'healthdoc',
  //     autoCancel: true,
  //     bigText:
  //       'This is local notification demo in React Native app. Only shown, when expanded.',
  //     subText: 'Local Notification Demo',
  //     title: 'Local Notification Title',
  //     message: 'Expand me to see more',
  //     vibrate: true,
  //     vibration: 300,
  //     playSound: true,
  //     soundName: 'default',
  //     actions: '["Yes", "No"]',
  //   });
  // };

  const openUrl = link => {
    if (Platform.OS == 'ios') {
      Linking.canOpenURL(link).then(
        supported => {
          if (supported) {
            Linking.openURL(link);
          } else {
            Alert.alert(
              'Unable to redirect to app store. Kindly search HealthDoc in app store and update',
            );
          }
        },
        err => {
          Alert.alert(
            'Unable to redirect to app store. Kindly search HealthDoc in app store and update',
          );
        },
      );
    } else {
      Linking.openURL(link);
    }
  };

  useEffect(async () => {
    let updateNeeded;
    try {
      updateNeeded = await VersionCheck.needUpdate();
    } catch (e) {
      console.log(e);
    }
    console.log(updateNeeded);
    if (updateNeeded && updateNeeded.isNeeded) {
      // versionUpdate();
      setstoreUrl(updateNeeded.storeUrl);
      setallPerm(3);
      setupdatePhoneVisible(true);
    } else {
      try {
        PushNotification.createChannel(
          {
            channelId: 'healthdoc-1232', // (required)
            channelName: 'My channel', // (required)
            channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
            playSound: true, // (optional) default: true
            soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
            importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
          },
          created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
        );
        const {currentUser} = auth();
        requestUserPermission();

        notificationListener();

        firestore()
          .collection('dashboardImg')
          .get()
          .then(querySnapshot => {
            var aData = [];
            querySnapshot.forEach(documentSnapshot => {
              if (documentSnapshot.id !== 'learningManagement') {
                var value = documentSnapshot.data();
                value.id = documentSnapshot.id;
                aData.push(value);
              } else {
                setlearningurl(documentSnapshot.data().url);
              }
            });
            setBanner(aData);
            // console.log(aData);
          })
          .catch(error => {
            console.log(error);
          });
        if (Platform.OS == 'ios') {
          checkMultiple([
            PERMISSIONS.IOS.CAMERA,
            PERMISSIONS.IOS.MICROPHONE,
          ]).then(statuses => {
            if (
              statuses[PERMISSIONS.IOS.CAMERA] == 'granted' &&
              statuses[PERMISSIONS.IOS.MICROPHONE] == 'granted'
            ) {
              setallPerm(2);
            } else {
              setallPerm(1);
            }
          });
        } else {
          checkMultiple([
            PERMISSIONS.ANDROID.CAMERA,
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.RECORD_AUDIO,
          ]).then(statuses => {
            if (
              statuses[PERMISSIONS.ANDROID.CAMERA] == 'granted' &&
              statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] ==
                'granted' &&
              statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] ==
                'granted' &&
              statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] == 'granted'
            ) {
              setallPerm(2);
            } else {
              setallPerm(1);
            }
          });
        }

        if (currentUser && currentUser.uid) {
          try {
            // setSubscriber(
            //   firestore()
            //     .collection('patient')
            //     .doc(currentUser.uid)
            //     .onSnapshot(documentSnapshot => {
            //       if (documentSnapshot.exists) {
            setloading(true);
            setsubtext('Updating your profile');
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
                    console.log(response.data.data, 'data');
                    var data = response.data.data.body;
                    data.id = response.data.data.id;
                    data.status = response.data.data.status;
                    data.member = response.data.data.member
                      ? response.data.data.member
                      : '';
                    setUser(data);
                    setUserProfile(data);
                    setloading(false);
                    setsubtext('');
                  })
                  .catch(error => {
                    setloading(false);
                    setsubtext('');
                    console.log('aya3');
                    console.log(error, 'Function error');
                  });
              })
              .catch(err => {
                setsubtext('');
                setloading(false);
                console.log(err);
              });
            //   }
            // }),
            // );
          } catch (err) {
            console.log(err);
          }
        } else {
          console.log('Erorrorororor');
        }
      } catch (e) {
        console.log('Erorrororororggg');
      }
    }
  }, []);

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS == 'ios') {
        requestMultiple([
          PERMISSIONS.IOS.CAMERA,
          PERMISSIONS.IOS.MICROPHONE,
        ]).then(statuses => {
          console.log(statuses);
          if (
            statuses[PERMISSIONS.IOS.CAMERA] == 'granted' &&
            statuses[PERMISSIONS.IOS.MICROPHONE] == 'granted'
          ) {
            setallPerm(2);
          } else if (
            statuses[PERMISSIONS.IOS.CAMERA] == 'blocked' ||
            statuses[PERMISSIONS.IOS.MICROPHONE] == 'blocked'
          ) {
            Alert.alert(
              'Incomplete permissions',
              'Kindly go to settings app and alow the mentioned permissions to continue.',
              [
                {text: 'Open Settings', onPress: () => Linking.openSettings()},
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel button clicked'),
                  style: 'cancel',
                },
              ],
              {
                cancelable: true,
              },
            );
          }
        });
      } else {
        requestMultiple([
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.RECORD_AUDIO,
        ]).then(statuses => {
          console.log(statuses);
          if (
            statuses[PERMISSIONS.ANDROID.CAMERA] == 'granted' &&
            statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] == 'granted' &&
            statuses[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] == 'granted' &&
            statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] == 'granted'
          ) {
            setallPerm(2);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={{flex: 1}}>
      {allPerm == 0 ? (
        <View style={{backgroundColor: '#F4F6FA', flex: 1}}></View>
      ) : allPerm == 3 ? (
        <Modal
          animationType="slide"
          transparent={false}
          visible={updatePhoneVisible}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              paddingHorizontal: 30,
            }}>
            <Image
              style={{width: 100, height: 100, marginBottom: 100}}
              source={require('../assets/logoSymbol.png')}
            />
            <Text
              style={{
                fontSize: Dimensions.get('window').width / 24,
                fontFamily: 'sans-serif-condensed',
                fontWeight: '700',
                textAlign: 'center',
              }}>
              You are using an older version of the app. Kinldy update the app
              for uninterrupted experience.
            </Text>
            <TouchableOpacity
              onPress={() => openUrl(storeUrl)}
              style={[styles.button, {marginTop: 20}]}
              activeOpacity={0.5}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: Dimensions.get('window').width / 20,
                  fontFamily: 'sans-serif-condensed',
                  padding: 10,
                  paddingHorizontal: 20,
                }}>
                Update
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
      ) : allPerm == 1 ? (
        <View style={styles.container}>
          <View style={styles.main}>
            {/* <View style={{alignItems: 'center', paddingBottom: 40}}>
              <Image
                style={{height: 80}}
                resizeMode="contain"
                source={require('../assets/logoWithText.png')}
              />
            </View> */}
            <View style={{alignItems: 'center'}}>
              <Text
                style={[
                  light,
                  {
                    fontSize: Dimensions.get('window').width / 25,
                    lineHeight: 30,
                    padding: 10,
                    alignItems: 'center',
                    color: 'black',
                    textAlign: 'center',
                  },
                ]}>
                To provide you a hassle-free connection, we need the following
                permissions:
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  padding: 30,
                }}>
                <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                  <Icon name="keyboard-voice" size={40} color="#54D9D5" />
                  <Text
                    style={[
                      light,
                      {
                        fontSize: Dimensions.get('window').width / 25,
                        color: 'black',
                      },
                    ]}>
                    Audio
                  </Text>
                </View>
                <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                  <Icon name="camera-alt" size={40} color="#54D9D5" />
                  <Text
                    style={[
                      light,
                      {
                        fontSize: Dimensions.get('window').width / 25,
                        color: 'black',
                      },
                    ]}>
                    Camera
                  </Text>
                </View>

                {Platform.OS != 'ios' && (
                  <View style={{alignItems: 'center', paddingHorizontal: 10}}>
                    <Icon name="sd-storage" size={40} color="#54D9D5" />
                    <Text
                      style={[
                        light,
                        {
                          fontSize: Dimensions.get('window').width / 25,
                          color: 'black',
                        },
                      ]}>
                      Storage
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  medium,
                  {
                    fontSize: Dimensions.get('window').width / 28,
                    padding: 10,
                    alignItems: 'center',
                    paddingTop: 15,
                    color: 'black',
                    textAlign: 'center',
                  },
                ]}>
                Note: You won't be able to continue, until you grant the
                permissions.
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.9}
              onPress={requestCameraPermission}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  fontSize: Dimensions.get('window').width / 20,
                  fontFamily: 'Trebuchet MS',
                  fontWeight: '700',
                  padding: 10,
                }}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          {Platform.OS == 'ios' ? (
            <View style={{backgroundColor: '#a2e2e2', flex: 1}}>{body()}</View>
          ) : (
            <View style={{flex: 1}}>{body()}</View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  max: {
    flex: 1,
  },
  fullView: {
    width: width,
    height: height - 100,
  },
  container: {
    backgroundColor: '#F4F6FA',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#54D9D5',
    width: Dimensions.get('window').width - 100,
  },
});
