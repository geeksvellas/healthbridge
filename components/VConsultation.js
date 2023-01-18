import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  ScrollView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {medium, light, button} from './Styles';
import BackButton from './utilities/BackButton';
import TextImageTile from './utilities/TextImageTile';
import Icon from 'react-native-vector-icons/dist/AntDesign';

const {width, height} = Dimensions.get('window');

export default function VConsultation({navigation}) {
  const onSelect = title => {
    navigation.navigate('Specialists', {title: title});
  };
  const onSearch = () => {};
  return (
    <View style={{backgroundColor: '#F4F6FA', flex: 1}}>
      <StatusBar backgroundColor="#F4F6FA" barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 20,
          }}>
          <BackButton />
          <View
            style={{
              paddingVertical: 10,
              marginHorizontal: 10,
              flex: 1,
            }}>
            <Text
              style={[
                medium,
                {
                  paddingVertical: 10,
                  textAlign: 'left',
                  color: 'black',
                  fontSize: width / 20,
                  flexWrap: 'wrap',
                },
              ]}>
              Video Consultation
            </Text>
            <Text
              style={[
                light,
                {textAlign: 'left', color: 'rgba(0,0,0,0.6)', flexWrap: 'wrap'},
              ]}>
              One to one doctor consultation, base on appointment booking
            </Text>
          </View>
        </View>
        <ScrollView
          alwaysBounceVertical={true}
          style={{paddingHorizontal: 20}}
          showsVerticalScrollIndicator={false}>
          {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 16,
            marginVertical: 20,
            marginHorizontal: 10,
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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={[{paddingHorizontal: 10, flex: 1}, medium]}
              placeholder="Search by anything"
            />
            <TouchableOpacity onPress={onSearch} style={[button, {paddingHorizontal: 15}]}>
              <Text style={[medium, {color: 'white'}]}>Search</Text>
            </TouchableOpacity>
          </View>
        </View> */}
          <TextImageTile
            pressButton={onSelect}
            title="Search by specialised care"
            sub="Over 1,000 Medical Specialist"
            style={{marginHorizontal: 10}}
            pic={require('../assets/consult2.png')}
          />
          <TextImageTile
            pressButton={() => navigation.navigate('Symptoms')}
            title="Search by symptoms"
            sub="Over 1,000 Medical Specialist"
            style={{marginHorizontal: 10}}
            pic={require('../assets/consult1.png')}
          />

          {/* <TextImageTile
            pressButton={() =>
              navigation.navigate('Doctors', {title: 'Doctors', param: 'All'})
            }
            title="Search by doctors"
            sub="Over 1,000 Medical Specialist"
            style={{marginHorizontal: 10}}
            pic={require('../assets/consult3.png')}
          /> */}
          <View style={{marginBottom: 100}}></View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({});
