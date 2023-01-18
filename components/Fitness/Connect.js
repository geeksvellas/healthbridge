import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Linking,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import qs from 'qs';
import config from '../../config';
import BackButton from '../utilities/BackButton';
import CustomButton from '../CustomButton';

import Tile from './Tile';
import {errorText, medium, clickText, bold, light} from '../Styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import Loader from '../Loader';

const {width, height} = Dimensions.get('window');

export default function Connect() {
  const [status, setstatus] = useState('Checking Status');
  const [errorMsg, seterrorMsg] = useState('');
  const [loading, setloading] = useState(false);
  const [sleepAvg, setSleepAvg] = useState(0);
  const [heartAvg, setheartAvg] = useState(0);
  const [stepsAvg, setstepsAvg] = useState(0);
  const [userData, setuserData] = useState(null);
  const navigation = useNavigation();

  const OAuth = client_id => {
    var EventList = Linking.addEventListener('url', handleUrl);
    async function handleUrl(event) {
      // console.log(event.url);
      EventList.remove();
      const [, query_string] = event.url.match(/\#(.*)/);
      // console.log(query_string);
      const query = qs.parse(query_string);
      // console.log(`query: ${JSON.stringify(query)}`);
      try {
        const jsonValue = JSON.stringify(query);
        await AsyncStorage.setItem('@token', jsonValue);
      } catch (e) {
        // saving error
        // console.log(e, 'error1');
        seterrorMsg(JSON.stringify(e));
      }
      getData(query.access_token, query.user_id);
    }
    const oauthurl = `https://www.fitbit.com/oauth2/authorize?${qs.stringify({
      client_id,
      response_type: 'token',
      scope: 'heartrate activity social weight nutrition profile sleep',
      redirect_uri: 'healthbridge://healthdoc',
      expires_in: '31536000',
    })}`;
    Linking.openURL(oauthurl).catch(err => {
      // console.log('Error processing linking', err);
      seterrorMsg(JSON.stringify(err));
    });
  };
  const connectFitbit = async () => {
    OAuth(config.client_id);
  };

  const logOut = async () => {
    setloading(true);
    const value = await AsyncStorage.getItem('@token');
    if (value !== null) {
      var val = JSON.parse(value);
      // console.log(val);
      fetch('https://api.fitbit.com/oauth2/revoke', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${val.access_token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `token=${val.access_token}`,
      })
        .then(res => res.json())
        .then(res => {
          setloading(false);
          if (res.success == false) {
            seterrorMsg(JSON.stringify(res));
          } else {
            // console.log(`success log out: ${JSON.stringify(res)}`);
            AsyncStorage.removeItem('@token');
            navigation.navigate('Home');
          }
        })
        .catch(err => {
          setloading(false);
          seterrorMsg(JSON.stringify(err));
          // console.log('Error log out: ', err);
        });
    } else {
      setloading(false);
      navigation.navigate('Home');
    }
  };

  const getActivityLog = (access_token, user_id) => {
    var currDate = new Date();
    var formatDate =
      currDate.getFullYear() +
      '-' +
      ('0' + (currDate.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + currDate.getDate()).slice(-2);
    fetch(
      'https://api.fitbit.com/1.2/user/' +
        user_id +
        '/activities/list.json?beforeDate=' +
        formatDate +
        '&sort=desc&offset=0&limit=1',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        // body: `root=auto&path=${Math.random()}`
      },
    )
      .then(res => res.json())
      .then(res => {
        if (res.success == false) {
          if (res.errors[0].errorType == 'expired_token') {
            // seterrorMsg(JSON.stringify(res));
            connectFitbit();
          } else {
            seterrorMsg(JSON.stringify(res));
          }
        } else {
          if (res.activities.length > 0) {
            setstepsAvg(res.activities[0]);
          }
          // console.log(`res: ${JSON.stringify(res)}`);
        }
      })
      .catch(err => {
        seterrorMsg(JSON.stringify(err));
        // console.log('Errorrr: ', err);
      });
  };

  const getHeartLog = (access_token, user_id) => {
    fetch(
      'https://api.fitbit.com/1.2/user/' +
        user_id +
        '/activities/heart/date/today/7d.json',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        // body: `root=auto&path=${Math.random()}`
      },
    )
      .then(res => res.json())
      .then(res => {
        if (res.success == false) {
          if (res.errors[0].errorType == 'expired_token') {
            // seterrorMsg(JSON.stringify(res));
            connectFitbit();
          } else {
            seterrorMsg(JSON.stringify(res));
          }
        } else {
          if (res['activities-heart'].length > 0) {
            var totalVal = 0;
            var numOfVal = 0;
            var date;
            res['activities-heart'].map(val => {
              val.value.heartRateZones.map(val1 => {
                totalVal += val1.max + val1.min;
                numOfVal += 2;
              });
              date = val.dateTime;
            });
            // console.log(totalVal, numOfVal, Math.floor(totalVal / numOfVal));
            setheartAvg({avgRate: Math.floor(totalVal / numOfVal), data: date});
          }
          // console.log(`res: ${JSON.stringify(res)}`);
        }
      })
      .catch(err => {
        seterrorMsg(JSON.stringify(err));
        // console.log('Error: ', err);
      });
  };
  const getSleepLog = (access_token, user_id) => {
    var currDate = new Date();
    var formatDate =
      currDate.getFullYear() +
      '-' +
      ('0' + (currDate.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + currDate.getDate()).slice(-2);
    fetch(
      'https://api.fitbit.com/1.2/user/' +
        user_id +
        '/sleep/list.json?beforeDate=' +
        formatDate +
        '&sort=desc&offset=0&limit=1',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        // body: `root=auto&path=${Math.random()}`
      },
    )
      .then(res => res.json())
      .then(res => {
        if (res.success == false) {
          if (res.errors[0].errorType == 'expired_token') {
            // seterrorMsg(JSON.stringify(res));
            connectFitbit();
          } else {
            seterrorMsg(JSON.stringify(res));
          }
        } else {
          if (res.sleep.length > 0) {
            setSleepAvg(res.sleep[0]);
          }
          console.log(`res: ${JSON.stringify(res)}`);
        }
      })
      .catch(err => {
        seterrorMsg(JSON.stringify(err));
        console.log('Errors: ', err);
      });
  };

  const getData = (access_token, user_id) => {
    fetch('https://api.fitbit.com/1/user/' + user_id + '/profile.json', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      // body: `root=auto&path=${Math.random()}`
    })
      .then(res => res.json())
      .then(res => {
        if (res.success == false) {
          if (res.errors[0].errorType == 'expired_token') {
            // seterrorMsg(JSON.stringify(res));
            connectFitbit();
          } else {
            seterrorMsg(JSON.stringify(res));
          }
        } else {
          // console.log(`res: ${JSON.stringify(res)}`);
          var user = res.user;
          if (user.height && user.weight) {
            user.bmi = calcBMI(user.height, user.weight);
            user.bmr = calcBMR(user);
          }
          setuserData(user);
        }
      })
      .catch(err => {
        seterrorMsg(JSON.stringify(err));
        console.log('Errorr: ', err);
      });
  };

  const calcBMI = (height, weight) => {
    var mLength = parseFloat(height) / 100;
    return (parseFloat(weight) / (mLength * mLength)).toFixed(1);
  };

  const calcBMR = user => {
    var result =
      88.368 +
      13.397 * parseFloat(user.weight) +
      4.799 * parseFloat(user.height) -
      5.677 * parseFloat(user.age);
    return result.toFixed(1);
  };

  const getFitbitData = async () => {
    try {
      seterrorMsg('');
      const value = await AsyncStorage.getItem('@token');
      console.log('token', value);
      if (value !== null) {
        var val = JSON.parse(value);
        getData(val.access_token, val.user_id);
        getSleepLog(val.access_token, val.user_id);
        getHeartLog(val.access_token, val.user_id);
        getActivityLog(val.access_token, val.user_id);
      } else {
        navigation.navigate('Disclaimer');
      }
    } catch (e) {
      seterrorMsg(JSON.stringify(e));
      console.log('error reading value');
    }
  };
  useEffect(async () => {
    getFitbitData();
  }, []);
  return (
    <View
      style={{
        paddingHorizontal: 20,
        backgroundColor: 'white',
        flex: 1,
      }}>
      <SafeAreaView style={{flex: 1}}>
        <Text style={[errorText]}>{errorMsg}</Text>
        {userData !== null && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Loader visible={loading} />

            <View
              style={[
                {
                  // width: width * 0.95,
                  paddingVertical: 20,
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                },
              ]}>
              {Platform.OS == 'ios' && (
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                  <Icon name="chevron-left" size={30} color="#000" />
                </TouchableOpacity>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: 10,
                  paddingLeft: 20,
                  alignItems: 'flex-start',
                  justifyContent: 'flex-start',
                }}>
                {userData && (
                  <Image
                    source={
                      userData.gender == 'MALE'
                        ? require('../../assets/icons/gender/male.png')
                        : require('../../assets/icons/gender/female.png')
                    }
                    style={{width: 60, height: 60}}
                  />
                )}
                <View style={{paddingHorizontal: 10}}>
                  {userData && (
                    <View>
                      <Text style={[medium, {fontSize: width / 15}]}>
                        Hi, {userData.displayName}
                      </Text>
                      <Text
                        style={[
                          medium,
                          {fontSize: width / 25, paddingVertical: 5},
                        ]}>
                        {userData.age} yrs
                      </Text>
                      <TouchableOpacity
                        style={{alignItems: 'flex-start'}}
                        onPress={logOut}>
                        <Text
                          style={[
                            clickText,
                            {
                              backgroundColor: '#54D9D5',
                              color: 'white',
                              paddingVertical: 10,
                              paddingHorizontal: 20,
                              borderRadius: 10,
                              fontSize: width / 30,
                              marginRight: 10,
                              ...Platform.select({
                                ios: {
                                  overflow: 'hidden',
                                },
                              }),
                            },
                          ]}>
                          Log Out
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {userData.height && userData.weight && (
              <View
                style={{
                  paddingHorizontal: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View>
                  <Text style={[medium, clickText, {paddingVertical: 5}]}>
                    HEIGHT
                  </Text>
                  <Text style={[bold, {fontSize: width / 20}]}>
                    {userData.height}
                  </Text>
                </View>
                <View>
                  <Text style={[medium, clickText, {paddingVertical: 5}]}>
                    WEIGHT
                  </Text>
                  <Text style={[bold, {fontSize: width / 20}]}>
                    {userData.weight}
                  </Text>
                </View>
                <View>
                  <Text style={[medium, clickText, {paddingVertical: 5}]}>
                    BMI
                  </Text>
                  <Text
                    style={[
                      bold,
                      {
                        fontSize: width / 20,
                        color:
                          userData.bmi >= 18.5 && userData.bmi <= 24.9
                            ? 'green'
                            : 'red',
                      },
                    ]}>
                    {userData.bmi}
                  </Text>
                </View>
              </View>
            )}
            <View style={{paddingHorizontal: 10, paddingTop: 25}}>
              <Text style={[bold, {fontSize: width / 15}]}>Metrics</Text>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={[styles.tile, {backgroundColor: '#7265E3'}]}>
                  <Text style={[medium, styles.tileTitle]}>SLEEP</Text>
                  <Image
                    source={require('../../assets/icons/fitness/sleep.png')}
                    style={{maxHeight: 60, width: '100%'}}
                    resizeMode="contain"
                  />
                  <Text style={[medium, styles.tileTitle]}>
                    {sleepAvg.minutesAsleep ? sleepAvg.minutesAsleep : 0} min
                  </Text>
                  <Text style={[medium, styles.tileSubTitle]}>Score:8/10</Text>
                  <Text style={[light, styles.tileSubTitle]}>
                    Last recorded on:
                  </Text>
                  <Text style={[light, styles.tileSubTitle]}>
                    {sleepAvg.dateOfSleep
                      ? new Date(sleepAvg.dateOfSleep).toDateString()
                      : new Date().toDateString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tile, {backgroundColor: '#FF9B90'}]}>
                  <Text style={[medium, styles.tileTitle]}>HEARTBEAT</Text>
                  <Image
                    source={require('../../assets/icons/fitness/rate.png')}
                    style={{maxHeight: 60, width: '100%'}}
                    resizeMode="contain"
                  />
                  <Text style={[medium, styles.tileTitle]}>
                    {heartAvg.avgRate ? heartAvg.avgRate : 0} BPM
                  </Text>
                  <Text style={[medium, styles.tileSubTitle]}>Score:8/10</Text>
                  <Text style={[light, styles.tileSubTitle]}>
                    Last recorded on:
                  </Text>
                  <Text style={[light, styles.tileSubTitle]}>
                    {heartAvg.date
                      ? new Date(heartAvg.date).toDateString()
                      : new Date().toDateString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tile, {backgroundColor: '#4C5980'}]}>
                  <Text style={[medium, styles.tileTitle]}>WALK</Text>
                  <View style={{alignItems: 'center'}}>
                    <Image
                      source={require('../../assets/icons/fitness/step.png')}
                      style={{maxHeight: 60, width: '100%'}}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[medium, styles.tileTitle]}>
                    {stepsAvg.steps ? stepsAvg.steps : 0} steps
                  </Text>
                  <Text style={[medium, styles.tileSubTitle]}>Score:8/10</Text>
                  <Text style={[light, styles.tileSubTitle]}>
                    Last recorded on:
                  </Text>
                  <Text style={[light, styles.tileSubTitle]}>
                    {stepsAvg.startTime
                      ? new Date(stepsAvg.startTime).toDateString()
                      : new Date().toDateString()}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tile, {backgroundColor: '#4C5980'}]}>
                  <Text style={[medium, styles.tileTitle]}>CALORIES</Text>
                  <View style={{alignItems: 'center'}}>
                    <Image
                      source={require('../../assets/icons/fitness/cal.png')}
                      style={{maxHeight: 60, width: '100%'}}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={[medium, styles.tileTitle]}>
                    {stepsAvg.calories ? stepsAvg.calories : 0} cal
                  </Text>
                  <Text style={[medium, styles.tileSubTitle]}>Score:8/10</Text>
                  <Text style={[light, styles.tileSubTitle]}>
                    Last recorded on:
                  </Text>
                  <Text style={[light, styles.tileSubTitle]}>
                    {stepsAvg.startTime
                      ? new Date(stepsAvg.startTime).toDateString()
                      : new Date().toDateString()}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{marginBottom: 100}}></View>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  points: {
    textAlign: 'center',
    color: '#7591af',
    fontSize: 40,
    fontWeight: '100',
  },
  tileTitle: {
    color: '#fff',
    fontSize: width / 25,
    paddingVertical: 10,
  },
  tileSubTitle: {
    color: '#fff',
    fontSize: width / 30,
  },
  tile: {
    borderRadius: 16,
    width: '48%',
    padding: 20,
    marginVertical: 5,
    paddingVertical: 20,
  },
});
