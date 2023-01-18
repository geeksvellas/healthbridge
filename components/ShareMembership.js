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
import Icon from 'react-native-vector-icons/dist/FontAwesome';

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
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/functions';
export default function ShareMembership({navigation}) {
  const [members, setmembers] = useState([]);
  const onShareMembership = () => {
    console.log('share membership');
    const filteredArr = Object.entries(members).filter(function ([key, value]) {
      return value.status !== false;
    });
    console.log(filteredArr.length);
    if (filteredArr.length > 4) {
      alert('Selecting more than 4 will cost 10 SGD each');
    }
  };
  useEffect(() => {
    setmembers([
      {
        name: 'Rudramani Pandey',
        phone: '+917204909749',
        status: false,
      },
      {
        name: 'Deepak',
        phone: '+917204909749',
        status: false,
      },
    ]);
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'row', paddingVertical: 20}}>
        <BackButton />
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 20,
            alignItems: 'center',
          }}>
          <Text style={[medium, {fontSize: width / 20, color: 'black'}]}>
            Add members
          </Text>
        </View>
      </View>
      <View style={{flex: 1}}>
        {members.length == 0 ? (
          <>
            <Text
              style={[
                medium,
                {
                  fontSize: width / 25,
                  paddingHorizontal: 20,
                  color: 'black',
                  textAlign: 'center',
                },
              ]}>
              Kindly add members to add them to your membership
            </Text>
            <View
              style={{
                alignItems: 'center',
                paddingTop: 20,
              }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Members')}
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
                  Click to add Member
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <ScrollView contentContainerStyle={{paddingBottom: 120}}>
              {members.map((data, id) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      let membersData = [...members];
                      membersData[id].status = !membersData[id].status;
                      setmembers(membersData);
                    }}
                    key={id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      backgroundColor: 'white',
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
                    <View style={{flexDirection: 'row'}}>
                      <View style={{justifyContent: 'center'}}>
                        <Icon
                          style={{
                            borderRadius: 10,
                            padding: 5,
                            color: !data.status ? 'rgba(0,0,0,0.3)' : '#54D9D5',
                            ...Platform.select({
                              ios: {
                                overflow: 'hidden',
                              },
                            }),
                          }}
                          name="check-circle-o"
                          size={50}
                        />
                      </View>
                      <View style={{padding: 10}}>
                        <Text style={[medium, {fontSize: width / 16}]}>
                          {data.name}
                        </Text>
                        <Text style={[medium]}>{data.phone}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View
              style={{
                alignItems: 'center',
                bottom: 80,
                position: 'absolute',
                left: 0,
                right: 0,
              }}>
              <TouchableOpacity
                onPress={onShareMembership}
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
                  Share membership
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
