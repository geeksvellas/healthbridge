import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import {medium, light} from './Styles';
import BackButton from './utilities/BackButton';
import TextImageTile from './utilities/TextImageTile';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('window');

export default function Doctors({route, navigation}) {
  const {param, title} = route.params;
  const [adoctors, setDoctors] = useState([]);
  const [tempData, settempData] = useState([]);
  const [loading, setloading] = useState(true);
  const onSelect = id => {
    navigation.navigate('DoctorCalendar', {id: id});
  };
  const searchFilterFunction = text => {
    var newData;
    if (text && adoctors) {
      newData = adoctors.filter(item => {
        if (item['firstname']) {
          const itemData = `${item['firstname'].toUpperCase()}`;
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        }
      });
    } else {
      newData = tempData;
    }
    setDoctors(newData);
  };
  useEffect(() => {
    if (param == 'speciality') {
      firestore()
        .collection('DoctorPublic')
        .where('speciality', 'array-contains', title.toLowerCase())
        .where('status', '==', true)
        .get()
        .then(querySnapshot => {
          var aData = [];
          querySnapshot.forEach(documentSnapshot => {
            var value = documentSnapshot.data();
            value.id = documentSnapshot.id;
            aData.push(value);
          });
          setloading(false);
          setDoctors(aData);
          settempData(aData);
          // console.log(aData);
        })
        .catch(error => {
          setloading(false);
          console.log(error);
        });
    } else if (param == 'searchtags') {
      firestore()
        .collection('DoctorPublic')
        .where('searchtags', 'array-contains', title.toLowerCase())
        .where('status', '==', true)
        .get()
        .then(querySnapshot => {
          var aData = [];
          querySnapshot.forEach(documentSnapshot => {
            var value = documentSnapshot.data();
            value.id = documentSnapshot.id;
            if (value['firstname']) {
              aData.push(value);
            }
          });
          setloading(false);
          settempData(aData);
          setDoctors(aData);
          // console.log(aData);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      firestore()
        .collection('DoctorPublic')
        .where('status', '==', true)
        .orderBy('counter', 'asc')
        .get()
        .then(querySnapshot => {
          var aData = [];
          querySnapshot.forEach(documentSnapshot => {
            var value = documentSnapshot.data();
            value.id = documentSnapshot.id;
            if (value['firstname']) {
              aData.push(value);
              // firestore()
              //   .collection('DoctorPublic')
              //   .doc(value.id)
              //   .collection('DoctorCalendar')
              //   .get()
              //   .then(querySnapshot2 => {
              //     // console.log('User exists: ', querySnapshot2.exists);
              //     if (querySnapshot2.size > 0) {
              //       querySnapshot2.forEach(documentSnapshot2 => {
              //         console.log(
              //           'User exists: ',
              //           value['firstname'],
              //           documentSnapshot2.data(),
              //         );
              //       });
              //       // setDefaultC(documentSnapshot.data());
              //     } else {
              //       // setDefaultC([]);
              //     }
              //   })
              //   .catch(error => {
              //     console.log(error);
              //   });
            }
          });
          // console.log(aData);
          setloading(false);
          settempData(aData);
          setDoctors(aData);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);
  return (
    <View style={{backgroundColor: '#F4F6FA', flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 20,
          }}>
          <BackButton />
          <View style={{paddingVertical: 10, paddingLeft: 20}}>
            <Text
              style={[
                medium,
                {
                  paddingVertical: 10,
                  textAlign: 'left',
                  color: 'black',
                  fontSize: width / 20,
                },
              ]}>
              {title}
            </Text>
            <Text
              style={[light, {textAlign: 'left', color: 'rgba(0,0,0,0.6)'}]}>
              Kindly select your preferred specialist
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 16,
            marginVertical: 20,
            marginHorizontal: 30,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="search1" size={30} color="#000" />
            <TextInput
              onChangeText={searchFilterFunction}
              style={[{paddingHorizontal: 10, flex: 1, color: 'black'}, medium]}
              placeholder="Doctor's Name"
              placeholderTextColor="rgba(0,0,0,0.4)"
            />
          </View>
        </View>
        <ScrollView
          style={{paddingHorizontal: 20}}
          showsVerticalScrollIndicator={false}>
          {loading ? (
            <Text style={[medium, {textAlign: 'center'}]}>
              Fetching Doctors...
            </Text>
          ) : (
            <View>
              {adoctors.length > 0 ? (
                <View>
                  {adoctors.map((value, index) => {
                    return (
                      <TextImageTile
                        key={index}
                        pressButton={() => onSelect(value.id)}
                        title={
                          value['firstname'].charAt(0).toUpperCase() +
                          value['firstname'].slice(1) +
                          ' ' +
                          value['lastname'].charAt(0).toUpperCase() +
                          value['lastname'].slice(1)
                        }
                        sub={value}
                        // quote={value.specialist}
                        style={{marginHorizontal: 10}}
                        pic={
                          value.img
                            ? {uri: value.img}
                            : require('../assets/Oval.png')
                        }
                      />
                    );
                  })}
                </View>
              ) : (
                <Text style={[medium, {textAlign: 'center'}]}>
                  No doctors found
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({});
