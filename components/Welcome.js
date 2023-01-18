import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  ScrollView,
  SafeAreaView,
} from 'react-native';

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
import CustomButton from './CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('window');
export default function Welcome({navigation}) {
  console.log(width);
  const onNext = async () => {
    var ifInstalled = await AsyncStorage.getItem('hb-isInstalled');
    if (ifInstalled && ifInstalled == 'true') {
      navigation.navigate('SignIn');
    } else {
      navigation.navigate('First');
    }
  };
  return (
    <View style={[container]}>
      <StatusBar backgroundColor="#f5f6fa" />
      <SafeAreaView>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
              width: width,
              marginTop: 20,
            }}>
            <Text style={[light, styles.heading]}>Welcome to</Text>
            <Image
              style={[width < 400 ? styles.heightM : null]}
              source={require('../assets/logoSymbol.png')}
            />
            <Image
              style={[
                width < 400
                  ? styles.heightMI
                  : {
                      resizeMode: 'cover',
                      width: '100%',
                    },
              ]}
              source={require('../assets/bg1.png')}
            />
          </View>

          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: width < 400 ? 0 : 40,
            }}>
            <CustomButton pressButton={onNext} nav="SignIn">
              Let’s get started!
            </CustomButton>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
    width: width,
  },
  heading: {
    fontSize: width / 20,
    textAlign: 'center',
    color: 'black',
    paddingBottom: 10,
  },
  heightM: {
    height: 100,
    resizeMode: 'contain',
  },
  heightMI: {
    height: 300,
    resizeMode: 'cover',
  },
});
