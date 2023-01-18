import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import BackButton from './utilities/BackButton';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import CustomButton from './CustomButton';
import firestore from '@react-native-firebase/firestore';
import {getUserProfile} from './functions/Details';
import EntypoIcon from 'react-native-vector-icons/dist/Entypo';

import {medium, clickText, bold, font15, light} from './Styles';
const {width, height} = Dimensions.get('window');

export default function AddTests({...props}) {
  const [test, settest] = useState(null);
  const [testValue, settestValue] = useState(null);
  const [results, setresults] = useState([]);
  const [user, setUser] = useState(null);

  const onSelectTest = val => {
    settest(val);
  };
  const clearTest = () => {
    settest(null);
  };
  const onAddTests = () => {
    var indication;
    if (test && testValue) {
      if (
        parseInt(testValue) >= parseInt(test[user.gender].lowerLimit) &&
        parseInt(testValue) <= parseInt(test[user.gender].upperLimit)
      ) {
        indication = '0';
      } else {
        indication = '1';
      }
      props.appendTest(
        test.name,
        testValue,
        test.unit,
        indication,
        test[user.gender].upperLimit,
        test[user.gender].lowerLimit,
      );
    }
  };
  useEffect(() => {
    setUser(getUserProfile);
    console.log(props.collectionName);
    firestore()
      .collection('Tests')
      .doc(props.collectionName)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setresults(documentSnapshot.data().value);
          // console.log(documentSnapshot.data().value);
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <KeyboardAvoidingView style={{backgroundColor: '#F4F6FA', flex: 1}}>
      <StatusBar backgroundColor="#F4F6FA" />
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 20,
            paddingTop: 40,
            alignItems: 'flex-start',
          }}>
          <TouchableOpacity
            style={{paddingVertical: 20}}
            onPress={props.onClose}>
            <EntypoIcon name="chevron-left" size={30} color="#000" />
          </TouchableOpacity>
          <View
            style={{
              paddingVertical: 20,
              paddingHorizontal: 20,
            }}>
            <Text style={[medium, {fontSize: width / 25, color: 'black'}]}>
              Add Laboratory Investigations
            </Text>
            <Text style={[light, {paddingTop: 10}]}>
              Kindly select your preferred specialist
            </Text>
          </View>
        </View>
        <View style={{marginHorizontal: 20}}>
          {test ? (
            <View>
              <Text
                style={[
                  medium,
                  {
                    color: '#898A8D',
                    fontSize: width / 25,
                    marginTop: 20,
                    marginLeft: 10,
                  },
                ]}>
                Name of Test
              </Text>
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
                <Text style={[medium]}>
                  {test.name.charAt(0).toUpperCase() + test.name.slice(1)}
                </Text>
                <TouchableOpacity onPress={clearTest}>
                  <Icon name="close" size={30} color="#000" />
                </TouchableOpacity>
              </View>
              <Text
                style={[
                  medium,
                  {
                    color: '#898A8D',
                    fontSize: width / 25,
                    marginTop: 20,
                    marginLeft: 10,
                  },
                ]}>
                Test Result
              </Text>
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
                <TextInput
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  onChangeText={text => settestValue(text)}
                  value={testValue}
                  placeholder="Enter test value"
                  style={[medium, {padding: 0, flex: 1, color: 'black'}]}
                />
                <Text style={[medium, {color: 'black'}]}>{test.unit}</Text>
              </View>
              <Text
                style={[
                  medium,
                  {
                    color: '#898A8D',
                    fontSize: width / 25,
                    marginTop: 20,
                    marginLeft: 10,
                  },
                ]}>
                {test.description}
              </Text>
              <Text
                style={[
                  medium,
                  {
                    color: '#898A8D',
                    fontSize: width / 25,
                    marginTop: 20,
                    marginLeft: 10,
                  },
                ]}>
                {test[user.gender].lowerLimit +
                  ' ' +
                  test.unit +
                  ' - ' +
                  test[user.gender].upperLimit +
                  ' ' +
                  test.unit}
              </Text>
              <View style={{alignItems: 'center', marginTop: 20}}>
                <CustomButton pressButton={onAddTests}>Add Result</CustomButton>
              </View>
            </View>
          ) : (
            <View>
              {results.length > 0 ? (
                <ScrollView>
                  {results.map((value, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => onSelectTest(value)}
                        key={index}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: 16,
                          padding: 20,
                          marginHorizontal: 20,
                          marginVertical: 10,
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
                          {value.name.charAt(0).toUpperCase() +
                            value.name.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              ) : (
                <Text
                  style={[
                    light,
                    {textAlign: 'center', fontSize: width / 20, padding: 20},
                  ]}>
                  Loading tests...
                </Text>
              )}
            </View>
          )}
        </View>

        <View style={{marginBottom: 100}}></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({});
