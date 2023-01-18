import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import BackButton from './utilities/BackButton';
import CustomDialog from './utilities/CustomDialog';
import Loader from './Loader';
// import Icon from 'react-native-vector-icons/dist/Ionicons';
import PaymentSubscription from './PaymentSubscription';
import {medium, clickText, bold, errorText, light} from './Styles';
const {width, height} = Dimensions.get('window');
import {getUserProfile, setUserProfile} from './functions/Details';

import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import {firebase} from '@react-native-firebase/functions';

export default function UpgradeMembership({navigation}) {
  const [cardVisible, setcardVisible] = useState(false);
  const [currMember, setcurrMember] = useState(null);
  const [upgradeMember, setupgradeMember] = useState([]);
  const [amount, setamount] = useState(false);
  const [selectedMembership, setselectedMembership] = useState(null);
  const [loading, setloading] = useState(false);
  const [alertVisible, setalertVisible] = useState(false);
  const [alertVisible1, setalertVisible1] = useState(false);
  const [alertText, setalertText] = useState(null);
  // const tenure = useRef(null);

  const cancelMembership = () => {
    var user = getUserProfile();
    const {currentUser} = auth();

    setloading(true);
    auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        firebase
          .app()
          .functions('asia-east2')
          .httpsCallable('cancelSubscription?token=' + idToken)({
            subscriptionId: user.member.subscriptionId,
          })
          .then(async responseJson => {
            console.log(responseJson);
            firestore()
              .collection('patient')
              .doc(currentUser.uid)
              .update({
                member: firestore.FieldValue.delete(),
              })
              .then(() => {
                delete user.member;
                setUserProfile(user);
                firestore()
                  .collection('members')
                  .doc(currentUser.uid)
                  .get()
                  .then(async documentSnapshot => {
                    if (documentSnapshot.exists) {
                      console.log();
                      var memData = documentSnapshot.data();
                      console.log('memData', memData);
                      // for (var i = 0; i < Object.keys(memData).length; i++) {
                      //   delete memData[i].subscribed;
                      // }
                      Object.keys(memData).forEach(val => {
                        delete memData[val].subscribed;
                      });
                      console.log('memData2', memData);

                      firestore()
                        .collection('members')
                        .doc(currentUser.uid)
                        .set(memData)
                        .then(() => {
                          setloading(false);
                          setalertText('Subscription cancelled successfully');
                          setTimeout(() => {
                            setalertVisible(true);
                          }, 500);
                        })
                        .catch(error => {
                          setloading(false);
                          setalertText('Operation failed. Try again later');
                          setTimeout(() => {
                            setalertVisible(true);
                          }, 500);
                        });
                    } else {
                      setloading(false);
                      setalertText('Subscription cancelled successfully');
                      setTimeout(() => {
                        setalertVisible(true);
                      }, 500);
                    }
                  })
                  .catch(error => {
                    console.log(error);
                    setloading(false);
                    setalertText('Operation failed. Try again later');
                    setTimeout(() => {
                      setalertVisible(true);
                    }, 500);
                  });
              })
              .catch(error => {
                setloading(false);
                setTimeout(() => {
                  setalertVisible(true);
                }, 500);
                setalertText('Operation failed. Try again later');
              });
          })
          .catch(error => {
            setloading(false);
            console.log(error, 'fetch error');
            setalertText('Operation failed. Try again later');
            setTimeout(() => {
              setalertVisible(true);
            }, 500);
          });
      })
      .catch(err => {
        setloading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    var user = getUserProfile();
    setTimeout(() => {
      setloading(true);
    }, 200);
    console.log(user.member);
    auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        firebase
          .app()
          .functions('asia-east2')
          .httpsCallable('getSubscription?token=' + idToken)({
            sID: user.member ? user.member.subscriptionId : null,
          })
          .then(async responseJson => {
            var subData = responseJson.data.message;
            console.log(JSON.stringify(subData));
            var planData = subData.plans.data;
            var currMemberData = user.member;
            if (subData.currSubs) {
              currMemberData.name = subData.currSubs.plan.product.name;
              currMemberData.shared =
                subData.currSubs.plan.product.metadata.shared;
              currMemberData.interval = subData.currSubs.plan.interval;
              currMemberData.amount = subData.currSubs.plan.amount / 100;
              currMemberData.description =
                subData.currSubs.plan.product.description;
              currMemberData.endDate = new Date(
                subData.currSubs.current_period_end * 1000,
              ).toDateString();
              if (!user.member.sharedBy) {
                planData = [];
                subData.plans.data.forEach(val => {
                  if (val.id !== subData.currSubs.plan.id) {
                    planData.push(val);
                  }
                });
              }
            }
            setcurrMember(currMemberData);
            setloading(false);
            setupgradeMember(planData);
          })
          .catch(error => {
            setloading(false);
            console.log(error, 'fetch error');
            setalertText('Something went wrong. Try again later');
            setTimeout(() => {
              setalertVisible(true);
            }, 500);
          });
      })
      .catch(err => {
        setloading(false);
        console.log(err);
      });
  }, []);
  const confirmPayment = responseJson => {
    console.log(responseJson, 'responseJson');
    setcardVisible(false);
    // console.log(tenure.current);
    const {currentUser} = auth();
    var user = getUserProfile();

    firestore()
      .collection('patient')
      .doc(currentUser.uid)
      .update({
        member: {
          status: 0,
          subscriptionId: responseJson.subscriptionId,
        },
      })
      .then(() => {
        // console.log(user.member, 'memberrrr');
        user.member = {
          status: 0,
          subscriptionId: responseJson.subscriptionId,
        };
        setUserProfile(user);
        if (user.member.sharedBy) {
          var userUId = currentUser.uid;
          var updateData = {
            [userUId + '.subscribed']: firestore.FieldValue.delete(),
          };
          firestore()
            .collection('members')
            .doc(user.member.sharedBy)
            .update(updateData)
            .then(() => {
              setloading(false);
              setalertText('Congratulations');
              setTimeout(() => {
                setalertVisible(true);
              }, 500);
            })
            .catch(error => {
              console.log(error);
              setloading(false);
              setTimeout(() => {
                setalertVisible(true);
              }, 500);
              setalertText('Something went wrong. Try again later');
            });
        } else {
          setloading(false);
          setalertText('Congratulations');
          setTimeout(() => {
            setalertVisible(true);
          }, 500);
        }
      })
      .catch(error => {
        console.log(error);
        setloading(false);
        setTimeout(() => {
          setalertVisible(true);
        }, 500);
        setalertText('Something went wrong. Try again later');
      });
  };
  const UpdateMemberShip = data => {
    var user = getUserProfile();
    if (user.member && !user.member.sharedBy) {
      ToastAndroid.show(
        'You have an existing membership. Kindly cancel it first.',
        ToastAndroid.LONG,
      );
    } else {
      setamount(data.unit_amount / 100);
      // tenure.current = data.tenure;
      setselectedMembership(data);
      setTimeout(() => {
        setcardVisible(true);
        // confirmPayment();
      }, 500);
    }
  };
  return (
    <KeyboardAvoidingView style={{backgroundColor: '#F4F6FA', flex: 1}}>
      <StatusBar backgroundColor="#F4F6FA" />
      <Loader visible={loading} />
      <ScrollView>
        <View style={{flexDirection: 'row', paddingVertical: 20}}>
          {Platform.OS == 'ios' && <BackButton />}
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
              Membership plan
            </Text>
          </View>
        </View>
        <Text
          style={[
            medium,
            {fontSize: width / 25, paddingHorizontal: 20, color: 'black'},
          ]}>
          Current Membership
        </Text>
        {currMember ? (
          <TouchableOpacity
            onPress={() => {
              if (!currMember.sharedBy && currMember.shared == 'true') {
                navigation.navigate('AddMemberMembership');
              }
            }}
            activeOpacity={
              !currMember.sharedBy && currMember.shared == 'true' ? 0 : 1
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#54D9D5',
              padding: 10,
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
              {!currMember.sharedBy ? (
                <>
                  <Text style={[medium, {fontSize: width / 16, color: '#fff'}]}>
                    {'$' + currMember.amount + ' /-' + currMember.interval}
                  </Text>
                  <Text style={[medium, {color: '#fff', fontSize: width / 22}]}>
                    {currMember.name}
                  </Text>
                  <Text style={[medium, {color: '#fff'}]}>
                    {currMember.description}
                  </Text>
                </>
              ) : (
                <Text style={[medium, {fontSize: width / 16, color: '#fff'}]}>
                  Shared Membership
                </Text>
              )}
              <Text style={[medium, {color: '#fff'}]}>
                Renews on : {currMember.endDate}
              </Text>
              {!currMember.sharedBy && (
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={() => setalertVisible1(true)}
                    style={{
                      padding: 10,
                      marginTop: 10,
                      backgroundColor: '#df4545',
                      borderRadius: 8,
                    }}>
                    <Text
                      style={[medium, {fontSize: width / 30, color: '#fff'}]}>
                      Cancel Membership
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {!currMember.sharedBy && currMember.shared == 'true' && (
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
                name="chevron-circle-right"
                size={width / 20}
              />
            )}
          </TouchableOpacity>
        ) : (
          <Text
            style={[
              medium,
              {
                fontSize: width / 25,
                color: 'black',
                textAlign: 'center',
                paddingVertical: 20,
              },
            ]}>
            No subscription yet
          </Text>
        )}

        <Text
          style={[
            medium,
            {
              paddingTop: 20,
              fontSize: width / 25,
              paddingHorizontal: 20,
              color: 'black',
            },
          ]}>
          Upgrade Membership
        </Text>
        {upgradeMember.length > 0 &&
          upgradeMember.map((data, id) => {
            return (
              <TouchableOpacity
                key={id}
                onPress={() => UpdateMemberShip(data)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  backgroundColor: '#54D9D5',
                  padding: 10,
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
                <View style={{padding: 10}}>
                  <Text style={[medium, {fontSize: width / 16, color: '#fff'}]}>
                    {'$' +
                      data.unit_amount / 100 +
                      ' /-' +
                      data.recurring.interval}
                  </Text>
                  <Text style={[medium, {color: '#fff', fontSize: width / 22}]}>
                    {data.product.name}
                  </Text>
                  <Text style={[medium, {color: '#fff'}]}>
                    {data.product.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        <View style={{marginBottom: 100}}></View>
      </ScrollView>
      <PaymentSubscription
        onStartLoading={() => setloading(true)}
        onConfirmPayment={confirmPayment}
        cardVisible={cardVisible}
        amount={amount}
        productID={selectedMembership ? selectedMembership.id : null}
        setModalVisible={() => {
          setloading(false);
          setcardVisible(false);
        }}
      />
      <CustomDialog
        visible={alertVisible}
        message={alertText}
        buttonText1="Ok"
        onpressButton1={() => navigation.pop()}
      />
      <CustomDialog
        visible={alertVisible1}
        message="Cancelling would terminate this subscription. Want to continue?"
        buttonText1="Yes"
        buttonText2="No"
        onpressButton1={() => {
          setalertVisible1(false);
          cancelMembership();
        }}
        onpressButton2={() => setalertVisible1(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
