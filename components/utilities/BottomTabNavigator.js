import React, {Component, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Text,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const {width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/dist/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Loader';
import FIcon from 'react-native-vector-icons/dist/FontAwesome5';

export default function BottomTabNavigator({active}) {
  const [loading, setloading] = useState(false);
  const navigation = useNavigation();
  const navFitness = async () => {
    setloading(true);
    try {
      const value = await AsyncStorage.getItem('@token');
      if (value !== null) {
        navigation.navigate('Connect');
        setloading(false);
      } else {
        navigation.navigate('Disclaimer');
        setloading(false);
      }
    } catch (e) {
      navigation.navigate('Disclaimer');
      setloading(false);
    }
  };
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: width,
        flexDirection: 'column',
      }}>
      {/* <TouchableOpacity
        onPress={navFitness}
        style={{
          position: 'absolute',
          alignSelf: 'center',
          backgroundColor: 'white',
          width: 70,
          height: 70,
          borderRadius: 35,
          bottom: 20,
          zIndex: 10,
        }}>
        <View>
          <View style={[styles.button, styles.actionBtn]}>
            <Icon name="heart" color="white" size={20} />
          </View>
        </View>
      </TouchableOpacity> */}
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          shadowOpacity: 0.3,
          shadowRadius: 3,
          shadowOffset: {
            height: 3,
            width: 3,
          },
          x: 0,
          y: 0,
          style: {marginVertical: 5},
          bottom: 0,
          width: '100%',
          height: 60,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 10,
          paddingHorizontal: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flex: 1,
          }}>
          <FIcon
            name="home"
            color={active == 'home' ? '#54D9D5' : '#D6D9E0'}
            size={30}
            onPress={() => navigation.navigate('Home')}
          />
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flex: 1,
          }}>
          <FIcon
            name="calendar"
            color={active == 'calendar-o' ? '#54D9D5' : '#D6D9E0'}
            size={30}
            onPress={() => navigation.navigate('Telemedicine')}
          />
        </View> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flex: 1,
          }}>
          <FIcon
            name="clipboard-list"
            color={active == 'file-text' ? '#54D9D5' : '#D6D9E0'}
            size={30}
            onPress={() => navigation.navigate('Telemedicine')}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flex: 1,
          }}>
          <FIcon
            name="users"
            color={active == 'members' ? '#54D9D5' : '#D6D9E0'}
            size={30}
            onPress={() => navigation.navigate('Members')}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flex: 1,
          }}>
          <FIcon
            name="user-alt"
            color={active == 'user' ? '#54D9D5' : '#D6D9E0'}
            size={30}
            onPress={() => navigation.navigate('Profile')}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
  button: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'grey',
    shadowOpacity: 0.1,
    shadowOffset: {x: 2, y: 0},
    shadowRadius: 2,
    borderRadius: 30,
    position: 'absolute',
    bottom: 20,
    right: 0,
    top: 5,
    left: 5,
    shadowOpacity: 5.0,
  },
  actionBtn: {
    backgroundColor: '#54D9D5',
    textShadowOffset: {width: 5, height: 5},
    textShadowRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
});
