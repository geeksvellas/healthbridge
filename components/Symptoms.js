import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {medium, light} from './Styles';
import BackButton from './utilities/BackButton';
import Tile from './utilities/Tile';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import firestore from '@react-native-firebase/firestore';
import Loader from './Loader';

const {width, height} = Dimensions.get('window');

export default function Symptoms({route, navigation, ...props}) {
  const [aSymptoms, setaSymptoms] = useState([]);
  const [loading, setloading] = useState(false);
  const [tempData, settempData] = useState([]);
  const searchFilterFunction = text => {
    setloading(true);
    var newData;
    if (text && tempData) {
      newData = tempData.filter(item => {
        const itemData = `${item['name'].toUpperCase()}`;
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
    } else {
      newData = [];
    }
    setaSymptoms(newData);
    setloading(false);
  };
  const onSelect = title => {
    navigation.navigate('Doctors', {title: title, param: 'searchtags'});
  };
  useEffect(() => {
    setloading(false);
    firestore()
      .collection('Symptoms')
      .get()
      .then(querySnapshot => {
        var aData = [];
        querySnapshot.forEach(documentSnapshot => {
          aData = aData.concat(documentSnapshot.data().value);
        });
        // setaSymptoms(aData);
        settempData(aData);
        // setloading(false);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  return (
    <View style={{backgroundColor: '#F4F6FA', flex: 1}}>
      {/* <Loader visible={loading} /> */}
      <StatusBar backgroundColor="#F4F6FA" barStyle="dark-content" />
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
              Search by symptoms
            </Text>
            <Text
              style={[light, {textAlign: 'left', color: 'rgba(0,0,0,0.6)'}]}>
              We are here for you
            </Text>
            {/* fe */}
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
              placeholder="Type here to search"
            />
          </View>
        </View>
        {aSymptoms.length > 0 && (
          <ScrollView
            style={{paddingHorizontal: 20}}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              {aSymptoms.map((value, index) => {
                return (
                  <Tile
                    key={index}
                    pressButton={() => onSelect(value.name)}
                    pic={{uri: value.icon}}>
                    {value.name.charAt(0).toUpperCase() + value.name.slice(1)}
                  </Tile>
                );
              })}
            </View>
          </ScrollView>
        )}
        {loading && (
          <ActivityIndicator
            style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.3)'}}
            color="#7265e3"
            size={100}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({});
