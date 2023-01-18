import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ImageBackground,
} from 'react-native';
import BottomTabNavigator from './utilities/BottomTabNavigator';
import AddMemberModal from './utilities/AddMemberModal';
import BackButton from './utilities/BackButton';
import Icon from 'react-native-vector-icons/dist/Foundation';
import {getUserProfile} from './functions/Details';
import {setSubscriber} from './functions/Details';

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
const {width, height} = Dimensions.get('window');
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/functions';
import Loader from './Loader';

export default function Members() {
  const [members, setmembers] = useState(null);
  const [addedMember, setaddedMember] = useState([]);
  const [requestedmembers, setrequestedmembers] = useState([]);
  const [addMember, setaddMember] = useState(false);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    const {currentUser} = auth();
    // console.log(currentUser);
    setSubscriber(
      firestore()
        .collection('members')
        .doc(currentUser.uid)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot.exists) {
            getMemberData();
          } else {
            setmembers([]);
          }
        }),
    );
  }, []);
  const onReject = (uid, index) => {
    setloading(true);
    auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        firebase
          .app()
          .functions('asia-east2')
          .httpsCallable('onRejectMemberReq?token=' + idToken)({
            uid: uid,
          })
          .then(data => {
            setloading(false);
            console.log(data, 'Success');
            // getMemberData();
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
  };
  const onAccept = (uid, index) => {
    var userData = getUserProfile();
    setloading(true);

    auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        firebase
          .app()
          .functions('asia-east2')
          .httpsCallable('onAcceptMemberReq?token=' + idToken)({
            uid: uid,
            body: {
              fname: userData.fname,
              lname: userData.lname,
              gender: userData.gender,
              phone: userData.phone,
            },
          })
          .then(data => {
            setloading(false);
            // getMemberData();
            console.log(data, 'Success');
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
  };
  const getMemberData = () => {
    var requests = [],
      sent = [],
      addMember = [];
    auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        firebase
          .app()
          .functions('asia-east2')
          .httpsCallable('getMembersInfo?token=' + idToken)()
          .then(data => {
            console.log(data.data);

            data.data.forEach(element => {
              if (element.status == 1) {
                requests.push(element);
              } else if (element.status == 0 || element.status == 3) {
                sent.push(element);
              } else if (element.status == 2) {
                addMember.push(element);
              }
            });
            setmembers(sent);
            setrequestedmembers(requests);
            setaddedMember(addMember);
          })
          .catch(error => {
            console.log(error);
            setmembers(sent);
            setrequestedmembers(requests);
          });
      })
      .catch(err => {
        // setloading(false);
        console.log(err);
      });
  };

  const convertStatus = status => {
    switch (status) {
      case 0:
        return 'Pending request';
      case 1:
        return 'Confirmation pending';
      case 2:
        return 'Accepted';
      case 3:
        return 'Declined';
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f6fa'}}>
      <View style={{flexDirection: 'row', paddingVertical: 20}}>
        <Loader visible={loading} />

        <BackButton />
        {/* <View
          style={{
            flexDirection: 'row',
            paddingVertical: 20,
            alignItems: 'center',
          }}>
          <Text style={[medium, {fontSize: width / 20, color: 'black'}]}>
            Members
          </Text>
        </View> */}
      </View>
      <ImageBackground
        style={{flex: 1, resizeMode: 'contain', backgroundColor: '#f5f6fa'}}
        resizeMode="contain"
        source={require('../assets/add_family_screen.png')}>
        <View style={{flex: 1}}>
          {members ? (
            <ScrollView contentContainerStyle={{paddingBottom: 120}}>
              {requestedmembers.length > 0 && (
                <>
                  <Text
                    style={[medium, {fontSize: width / 25, paddingLeft: 20}]}>
                    Received
                  </Text>
                  {requestedmembers.map((data, id) => {
                    return (
                      <View
                        key={id}
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
                        }}>
                        <Image
                          style={{width: 50, height: 50}}
                          source={
                            data.body.gender
                              ? data.body.gender == 'male'
                                ? require('../assets/icons/gender/male.png')
                                : require('../assets/icons/gender/female.png')
                              : require('../assets/defaultAvatar.png')
                          }
                        />
                        <View style={{marginLeft: 20, flex: 1}}>
                          <Text style={[medium, {fontSize: width / 16}]}>
                            {data.body.fname + ' ' + data.body.lname}
                          </Text>
                          <Text style={[medium]}>{data.body.phone}</Text>
                          <Text style={[medium]}>
                            {convertStatus(data.status)}
                          </Text>
                          <View
                            style={{
                              flexDirection: 'row',
                              paddingVertical: 10,
                            }}>
                            <TouchableOpacity
                              style={{marginRight: 10}}
                              onPress={() => onAccept(data.uid, id)}>
                              <Icon
                                style={{
                                  borderRadius: 10,
                                  padding: 12,
                                  paddingHorizontal: 15,
                                  color: '#fff',
                                  backgroundColor: '#54D9D5',
                                  ...Platform.select({
                                    ios: {
                                      overflow: 'hidden',
                                    },
                                  }),
                                }}
                                name="check"
                                size={15}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => onReject(data.uid, id)}>
                              <Icon
                                style={{
                                  borderRadius: 10,
                                  padding: 12,
                                  paddingHorizontal: 15,
                                  color: '#fff',
                                  backgroundColor: 'red',
                                  ...Platform.select({
                                    ios: {
                                      overflow: 'hidden',
                                    },
                                  }),
                                }}
                                name="x"
                                size={width / 30}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </>
              )}

              {members.length > 0 && (
                <>
                  <Text
                    style={[
                      medium,
                      {fontSize: width / 25, paddingLeft: 20, paddingTop: 20},
                    ]}>
                    Sent
                  </Text>
                  {members.map((data, id) => {
                    return (
                      <View
                        key={id}
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
                        }}>
                        <Image
                          style={{width: 50, height: 50}}
                          source={
                            data.body.gender
                              ? data.body.gender == 'male'
                                ? require('../assets/icons/gender/male.png')
                                : require('../assets/icons/gender/female.png')
                              : require('../assets/defaultAvatar.png')
                          }
                        />
                        <View style={{marginLeft: 20, flex: 1}}>
                          <Text style={[medium, {fontSize: width / 16}]}>
                            {data.body.fname + ' ' + data.body.lname}
                          </Text>
                          <Text style={[medium]}>{data.body.phone}</Text>
                          <Text
                            style={[
                              medium,
                              {color: data.status == 3 ? 'red' : 'orange'},
                            ]}>
                            {convertStatus(data.status)}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </>
              )}
              {addedMember.length > 0 ? (
                <>
                  <Text
                    style={[
                      medium,
                      {fontSize: width / 25, paddingLeft: 20, paddingTop: 20},
                    ]}>
                    Members
                  </Text>
                  {addedMember.map((data, id) => {
                    return (
                      <View
                        key={id}
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
                        }}>
                        <Image
                          style={{width: 50, height: 50}}
                          source={
                            data.body.gender
                              ? data.body.gender == 'male'
                                ? require('../assets/icons/gender/male.png')
                                : require('../assets/icons/gender/female.png')
                              : require('../assets/defaultAvatar.png')
                          }
                        />
                        <View style={{marginLeft: 20, flex: 1}}>
                          <Text style={[medium, {fontSize: width / 16}]}>
                            {data.body.fname + ' ' + data.body.lname}
                          </Text>
                          <Text style={[medium]}>{data.body.phone}</Text>
                          {data.nickname !== undefined &&
                            data.nickname !== '' && (
                              <Text style={[medium]}>{data.body.nickname}</Text>
                            )}
                        </View>
                      </View>
                    );
                  })}
                </>
              ) : (
                <></>
                // <Text
                //   style={[
                //     medium,
                //     {
                //       fontSize: width / 25,
                //       color: 'black',
                //       textAlign: 'center',
                //       paddingVertical: 20,
                //     },
                //   ]}>
                //   No members added
                // </Text>
              )}
              <View style={{marginBottom: 100}}></View>
            </ScrollView>
          ) : (
            <Text
              style={[
                medium,
                {fontSize: width / 25, color: 'black', textAlign: 'center'},
              ]}>
              Fetching member list...
            </Text>
          )}
          <View
            style={{
              alignItems: 'center',
              bottom: 80,
              position: 'absolute',
              left: 0,
              right: 0,
            }}>
            <TouchableOpacity
              onPress={() => setaddMember(true)}
              style={{
                padding: 10,
                backgroundColor: '#54D9D5',
                borderRadius: 10,
                width: width * 0.6,
              }}>
              <Text
                style={[
                  medium,
                  {color: '#fff', fontSize: width / 20, textAlign: 'center'},
                ]}>
                Add Member
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      <AddMemberModal
        visible={addMember}
        onExit={() => {
          setaddMember(false);
          getMemberData();
        }}
      />
      <BottomTabNavigator active="members" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
