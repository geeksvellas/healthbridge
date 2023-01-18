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
} from 'react-native';
import BottomTabNavigator from './utilities/BottomTabNavigator';
import AddMemberModal from './utilities/AddMemberModal';
import BackButton from './utilities/BackButton';
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
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import auth from '@react-native-firebase/auth';
import CustomDialog from './utilities/CustomDialog';
import {firebase} from '@react-native-firebase/functions';
import Loader from './Loader';
import {setSubscriber} from './functions/Details';
import firestore from '@react-native-firebase/firestore';

export default function AddMemberMembership({navigation}) {
  const [members, setmembers] = useState([]);
  const [linkMembers, setlinkMembers] = useState([]);
  const [selMember, setselMember] = useState(null);
  const [alertVisible, setalertVisible] = useState(false);
  const [alertVisible2, setalertVisible2] = useState(false);
  const [alertText, setalertText] = useState(false);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true);
    const {currentUser} = auth();
    setSubscriber(
      firestore()
        .collection('members')
        .doc(currentUser.uid)
        .onSnapshot(documentSnapshot => {
          if (documentSnapshot.exists) {
            auth()
              .currentUser.getIdToken(true)
              .then(function (idToken) {
                firebase
                  .app()
                  .functions('asia-east2')
                  .httpsCallable('getApprovedMembers?token=' + idToken)()
                  .then(data => {
                    var linkM = [];
                    var aMem = [];
                    console.log(data);
                    data.data.map(value => {
                      if (value.subscribed) {
                        linkM.push(value);
                      } else {
                        aMem.push(value);
                      }
                    });
                    setloading(false);

                    setlinkMembers(linkM);
                    setmembers(aMem);
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
          }
        }),
    );
  }, []);

  const onAddMember = () => {
    setloading(true);
    auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        firebase
          .app()
          .functions('asia-east2')
          .httpsCallable('onUpdateMembership?token=' + idToken)({
            uid: selMember,
          })
          .then(data => {
            setloading(false);
            setalertText('Member was successfully added.');
            setalertVisible2(true);
            console.log(data);
          })
          .catch(error => {
            setloading(false);
            setalertText(error.message);
            setalertVisible2(true);
            console.log(error);
          });
      })
      .catch(err => {
        setloading(false);

        console.log(err);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Loader visible={loading} />

      <View style={{flexDirection: 'row', paddingVertical: 20}}>
        <BackButton />
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 20,
            alignItems: 'center',
          }}>
          <Text style={[medium, {fontSize: width / 20, color: 'black'}]}>
            Members
          </Text>
        </View>
      </View>
      <View style={{flex: 1}}>
        <ScrollView contentContainerStyle={{paddingBottom: 120}}>
          <Text
            style={[
              medium,
              {
                fontSize: width / 25,
                paddingHorizontal: 20,
                color: 'black',
              },
            ]}>
            Linked members
          </Text>
          {linkMembers.length > 0 ? (
            linkMembers.map((data, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#54D9D5',
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
                  <View style={{padding: 10, flex: 1}}>
                    <Text
                      style={[medium, {fontSize: width / 16, color: 'white'}]}>
                      {data.body.fname.charAt(0).toUpperCase() +
                        data.body.fname.slice(1)}{' '}
                      {data.body.lname.charAt(0).toUpperCase() +
                        data.body.lname.slice(1)}
                    </Text>
                    <Text style={[medium, {color: 'white'}]}>
                      {data.body.phone}
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text
              style={[
                medium,
                {
                  fontSize: width / 25,
                  padding: 20,
                  color: 'rgba(0,0,0,0.6)',
                  textAlign: 'center',
                },
              ]}>
              No members
            </Text>
          )}
          <Text
            style={[
              medium,
              {
                fontSize: width / 25,
                paddingHorizontal: 20,
                paddingTop: 20,
                color: 'black',
              },
            ]}>
            Add members
          </Text>
          {members.length > 0 ? (
            members.map((data, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#54D9D5',
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
                  <View style={{padding: 10, flex: 1}}>
                    <Text
                      style={[medium, {fontSize: width / 16, color: 'white'}]}>
                      {data.body.fname.charAt(0).toUpperCase() +
                        data.body.fname.slice(1)}{' '}
                      {data.body.lname.charAt(0).toUpperCase() +
                        data.body.lname.slice(1)}
                    </Text>
                    <Text style={[medium, {color: 'white'}]}>
                      {data.body.phone}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setTimeout(() => {
                        setalertVisible(true);
                      }, 500);
                      setselMember(data.uid);
                    }}>
                    <Icon
                      style={{
                        borderRadius: 10,
                        padding: 12,
                        color: '#fff',
                        backgroundColor: '#54D9D5',
                        ...Platform.select({
                          ios: {
                            overflow: 'hidden',
                          },
                        }),
                      }}
                      name="plus-circle"
                      size={width / 15}
                    />
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text
              style={[
                medium,
                {
                  fontSize: width / 25,
                  padding: 20,
                  color: 'rgba(0,0,0,0.6)',
                  textAlign: 'center',
                },
              ]}>
              No existing members to add to your subscription
            </Text>
          )}
        </ScrollView>
        <CustomDialog
          visible={alertVisible}
          message="This action is not reversible. Do you still want to add this member as part of your subscription?"
          buttonText1="Yes"
          buttonText2="Cancel"
          onpressButton1={() => {
            setalertVisible(false);
            onAddMember();
          }}
          onpressButton2={() => setalertVisible(false)}
        />
        <CustomDialog
          visible={alertVisible2}
          message={alertText}
          buttonText1="Ok"
          onpressButton1={() => setalertVisible2(false)}
        />
        {/* <View
          style={{
            alignItems: 'center',
            bottom: 80,
            position: 'absolute',
            left: 0,
            right: 0,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ShareMembership')}
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
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
