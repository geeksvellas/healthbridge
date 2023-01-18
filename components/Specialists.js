import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {medium, light} from './Styles';
import BackButton from './utilities/BackButton';
import Tile from './utilities/Tile';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('window');

export default function Specialists({route, navigation, ...props}) {
  const [aSpecialists, setaSpecialists] = useState([]);

  const onSelect = title => {
    navigation.navigate('Doctors', {title: title, param: 'speciality'});
  };
  useEffect(() => {
    firestore()
      .collection('MedicalSpecialty')
      .get()
      .then(querySnapshot => {
        var aData = [];
        querySnapshot.forEach(documentSnapshot => {
          aData = aData.concat(documentSnapshot.data().value);
        });
        setaSpecialists(aData);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  return (
    <View style={{backgroundColor: '#F4F6FA', flex: 1}}>
      <StatusBar backgroundColor="#F4F6FA" barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 10,
          }}>
          <BackButton />
          <View
            style={{
              paddingVertical: 10,
              marginHorizontal: 10,
              flex: 1,
              paddingRight: 20,
            }}>
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
              Search by specialists
            </Text>
            <Text
              style={[
                light,
                {textAlign: 'left', color: 'rgba(0,0,0,0.6)', flexWrap: 'wrap'},
              ]}>
              For first visit, we will recommend you to book a 30 min time slot.
            </Text>
            <Text
              style={[
                light,
                {textAlign: 'left', color: 'rgba(0,0,0,0.6)', flexWrap: 'wrap'},
              ]}>
              For repeated visit, we will recommend you to book a 15 min time
              slot.
            </Text>
          </View>
        </View>
        <ScrollView
          style={{paddingHorizontal: 20}}
          showsVerticalScrollIndicator={false}>
          {aSpecialists.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
              }}>
              {aSpecialists.map((value, index) => {
                return (
                  <Tile
                    key={index}
                    desc={value.desc}
                    pressButton={title => onSelect(title)}
                    pic={{uri: value.icon}}>
                    {value.name.charAt(0).toUpperCase() + value.name.slice(1)}
                  </Tile>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({});
