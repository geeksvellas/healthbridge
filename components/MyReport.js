import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  StatusBar,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import BackButton from './utilities/BackButton';
import BottomTabNavigator from './utilities/BottomTabNavigator';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import {virgilCrypto} from 'react-native-virgil-crypto';
import {firebase} from '@react-native-firebase/functions';
import MaterialTabs from 'react-native-material-tabs';
import {medium, clickText, bold, font15, light} from './Styles';
const {width, height} = Dimensions.get('window');
export default function MyReport({navigation}) {
  const [result, setresult] = useState([]);
  const [resultShared, setresultShared] = useState([]);
  const [loading, setloading] = useState(true);
  const [loadingShared, setloadingShared] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  useEffect(() => {
    const {currentUser} = auth();
    setloading(true);
    setloadingShared(true);
    auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        firebase
          .app()
          .functions('asia-east2')
          .httpsCallable('getReportFile?token=' + idToken)({
            patientID: currentUser.uid,
          })
          .then(response => {
            // console.log(response, 'reportData');
            var adata = response.data.data;
            console.log(adata);
            setresult(response.data.data);
            setloading(false);
            // navigation.pop();
          })
          .catch(error => {
            setloading(false);
            console.log(error, 'Function error');
          });
      })
      .catch(error => {
        setloading(false);
        console.log(error, 'File upload');
      });
    auth()
      .currentUser.getIdToken(true)
      .then(function (idToken) {
        firebase
          .app()
          .functions('asia-east2')
          .httpsCallable('getSharedReportFile?token=' + idToken)({
            patientID: currentUser.uid,
          })
          .then(response => {
            // console.log(response, 'reportData');
            var adata = response.data.data;
            console.log(adata);
            setresultShared(response.data.data);
            setloadingShared(false);
            // navigation.pop();
          })
          .catch(error => {
            setloadingShared(false);
            console.log(error, 'Function error');
          });
      })
      .catch(error => {
        setloadingShared(false);
        console.log(error, 'File upload');
      });
  }, []);
  const onChangeTab = index => {
    setSelectedTab(index);
  };
  return (
    <KeyboardAvoidingView
      style={{backgroundColor: '#F4F6FA', flex: 1, paddingTop: 30}}>
      <StatusBar backgroundColor="#F4F6FA" />
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          {Platform.OS == 'ios' && (
            <View style={{flexDirection: 'row'}}>
              <BackButton />
            </View>
          )}
          <View style={{marginHorizontal: 30}}>
            <MaterialTabs
              items={['My Reports', 'Shared with me']}
              selectedIndex={selectedTab}
              onChange={onChangeTab}
              barColor="#F4F6FA"
              indicatorColor="#54D9D5"
              activeTextColor="#54D9D5"
              inactiveTextColor="black"
              textStyle={[medium]}
            />
            {selectedTab == 0 ? (
              loading ? (
                <View style={{marginTop: 30}}>
                  <Text style={[medium, {textAlign: 'center'}]}>
                    Fetching Reports...
                  </Text>
                </View>
              ) : (
                <View>
                  {result.length > 0 ? (
                    <View style={{marginTop: 30}}>
                      {result.map((value, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            style={{
                              justifyContent: 'space-between',
                              backgroundColor: 'white',
                              borderTopWidth: index != 0 ? 1 : 0,
                              borderColor: 'rgba(0,0,0,0.1)',
                              flexDirection: 'row',
                              // alignItems: 'center',
                              paddingVertical: 20,
                              paddingHorizontal: 20,
                              marginVertical: 5,
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
                              borderRadius: 10,
                            }}
                            onPress={() =>
                              navigation.navigate('MyReportDetails', {
                                value: value,
                                isOwner: true,
                              })
                            }>
                            <View style={{flex: 2}}>
                              <Text style={[medium, {fontSize: width / 30}]}>
                                {value.body.testName.charAt(0).toUpperCase() +
                                  value.body.testName.slice(1)}
                              </Text>
                              <Text style={[light, {fontSize: width / 35}]}>
                                {value.id}
                              </Text>
                              <Text style={[light, {fontSize: width / 35}]}>
                                {value.body.reportDateObject}
                              </Text>
                            </View>
                            {value.type == 'manualPatient' ? (
                              <View
                                style={{
                                  alignItems: 'flex-end',
                                  flex: 1,
                                }}>
                                <Text
                                  style={[
                                    medium,
                                    {
                                      fontSize: width / 30,
                                      color: JSON.parse(value.body.testResults)
                                        .indication
                                        ? JSON.parse(value.body.testResults)
                                            .indication == 1
                                          ? 'red'
                                          : 'green'
                                        : 'black',
                                    },
                                  ]}>
                                  {JSON.parse(value.body.testResults)
                                    .value.charAt(0)
                                    .toUpperCase() +
                                    JSON.parse(
                                      value.body.testResults,
                                    ).value.slice(1)}
                                </Text>
                                <Text
                                  style={[
                                    light,
                                    {
                                      fontSize: width / 35,
                                    },
                                  ]}>
                                  {JSON.parse(value.body.testResults).limits}
                                </Text>
                              </View>
                            ) : (
                              <Icon
                                name="ios-document-attach-sharp"
                                size={25}
                                color="#54D9D5"
                                style={{paddingHorizontal: 10}}
                              />
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : (
                    <View style={{marginTop: 30}}>
                      <Text style={[medium, {textAlign: 'center'}]}>
                        No reports to display
                      </Text>
                    </View>
                  )}
                </View>
              )
            ) : loadingShared ? (
              <View style={{marginTop: 30}}>
                <Text style={[medium, {textAlign: 'center'}]}>
                  Fetching Shared Reports...
                </Text>
              </View>
            ) : (
              <View>
                {resultShared.length > 0 ? (
                  <View style={{marginTop: 30}}>
                    {resultShared.map((value, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          style={{
                            backgroundColor: 'white',
                            borderTopWidth: index != 0 ? 1 : 0,
                            borderColor: 'rgba(0,0,0,0.1)',
                            alignItems: 'flex-start',
                            display: 'flex',
                            paddingVertical: 20,
                            paddingHorizontal: 20,
                            marginVertical: 5,
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
                            borderRadius: 10,
                          }}
                          onPress={() =>
                            navigation.navigate('MyReportDetails', {
                              value: value,
                              isOwner: false,
                            })
                          }>
                          <View
                            style={{
                              justifyContent: 'space-between',
                              flexDirection: 'row',
                            }}>
                            <View style={{flex: 2}}>
                              <Text style={[medium, {fontSize: width / 30}]}>
                                {value.body.testName.charAt(0).toUpperCase() +
                                  value.body.testName.slice(1)}
                              </Text>
                              <Text style={[light, {fontSize: width / 35}]}>
                                {value.body.reportDateObject}
                              </Text>
                              {value.body.owner !== undefined && (
                                <Text style={[light, {fontSize: width / 35}]}>
                                  {'by ' + value.body.owner}
                                </Text>
                              )}
                            </View>
                            {value.type == 'manualPatient' ? (
                              <View
                                style={{
                                  alignItems: 'flex-end',
                                  flex: 1,
                                }}>
                                <Text
                                  style={[
                                    medium,
                                    {
                                      fontSize: width / 30,
                                      color: JSON.parse(value.body.testResults)
                                        .indication
                                        ? JSON.parse(value.body.testResults)
                                            .indication == 1
                                          ? 'red'
                                          : 'green'
                                        : 'black',
                                    },
                                  ]}>
                                  {JSON.parse(value.body.testResults)
                                    .value.charAt(0)
                                    .toUpperCase() +
                                    JSON.parse(
                                      value.body.testResults,
                                    ).value.slice(1)}
                                </Text>
                                <Text
                                  style={[
                                    light,
                                    {
                                      fontSize: width / 35,
                                    },
                                  ]}>
                                  {JSON.parse(value.body.testResults).limits}
                                </Text>
                              </View>
                            ) : (
                              <Icon
                                name="ios-document-attach-sharp"
                                size={25}
                                color="#54D9D5"
                                style={{paddingHorizontal: 10}}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={{marginTop: 30}}>
                    <Text style={[medium, {textAlign: 'center'}]}>
                      No reports to display
                    </Text>
                  </View>
                )}
              </View>
              // <View style={{marginTop: 30}}>
              //   <Text style={[medium, {textAlign: 'center'}]}>
              //     Shared Reports
              //   </Text>
              // </View>
            )}
          </View>
          <View style={{marginBottom: 100}}></View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
