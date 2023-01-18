import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {medium, clickText, bold, light} from './Styles';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import BackButton from './utilities/BackButton';
import CustomButton from './CustomButton';
import HTile from './utilities/HTile';
import BottomTabNavigator from './utilities/BottomTabNavigator';
import {useRoute} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/functions';
import {getUserProfile} from './functions/Details';
import Loader from './Loader';
import CustomDialog from './utilities/CustomDialog';

const {width, height} = Dimensions.get('window');

export default function ReportDash({navigation}) {
  const [user, setUser] = useState(null);
  const [navigated, setnavigated] = useState(false);
  const [loading, setloading] = useState(false);
  const [alertVisible, setalertVisible] = useState(false);

  useEffect(() => {
    var userData = getUserProfile();
    if (userData.height && userData.weight) {
      var mLength = parseFloat(userData.height) / 100;
      var bmi = parseFloat(userData.weight) / (mLength * mLength);
      console.log(userData);
      userData.bmi = bmi.toFixed(1);
      console.log(userData);
    }
    setUser(userData);
  }, []);

  const uploadReport = () => {
    console.log(user);
    const {currentUser} = auth();
    if (user.member) {
      navigation.navigate('UploadReport');
    } else {
      setloading(true);
      firestore()
        .collection('reports')
        .where('patientID', '==', currentUser.uid)
        .where('type', '==', 'filePatient')
        .get()
        .then(querySnapshot => {
          setloading(false);
          console.log(querySnapshot.size);

          if (querySnapshot.size < 3) {
            navigation.navigate('UploadReport');
          } else {
            setTimeout(() => {
              setalertVisible(true);
            }, 500);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const uploadReportManual = () => {
    console.log(user);
    const {currentUser} = auth();
    navigation.navigate('AddLabReport');
  };

  return (
    <View style={{backgroundColor: '#F4F6FA', flex: 1}}>
      <StatusBar backgroundColor="#F4F6FA" />

      <SafeAreaView style={{flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Loader visible={loading} />
          <View style={{flexDirection: 'row', paddingTop: 20}}>
            <BackButton />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TouchableOpacity>
                {user && (
                  <Image
                    source={
                      user.gender == 'male'
                        ? require('../assets/icons/gender/male.png')
                        : require('../assets/icons/gender/female.png')
                    }
                    style={{width: 60, height: 60}}
                  />
                )}
              </TouchableOpacity>
              <View style={{padding: 10}}>
                {/* <Text style={[medium, clickText]}>{}</Text> */}
                {user && (
                  <Text style={[medium, {fontSize: width / 20}]}>
                    Hi,{' '}
                    {user.fname.charAt(0).toUpperCase() + user.fname.slice(1)}{' '}
                    {user.lname.charAt(0).toUpperCase() + user.lname.slice(1)}
                  </Text>
                )}
              </View>
            </View>
          </View>
          {user &&
            (user.height && user.weight ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  paddingVertical: 20,
                }}>
                <View>
                  <Text style={[medium, clickText, {paddingVertical: 5}]}>
                    HEIGHT
                  </Text>
                  <Text style={[bold, {fontSize: width / 20}]}>
                    {user.height}
                  </Text>
                </View>
                <View>
                  <Text style={[medium, clickText, {paddingVertical: 5}]}>
                    WEIGHT
                  </Text>
                  <Text style={[bold, {fontSize: width / 20}]}>
                    {user.weight}
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
                          user.bmi >= 18.5 && user.bmi <= 24.9
                            ? 'green'
                            : 'red',
                      },
                    ]}>
                    {user.bmi}
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <CustomButton
                  pressButton={() => {
                    setnavigated(true);
                    navigation.navigate('EditProfile');
                  }}>
                  Kindly update your height and weight
                </CustomButton>
              </View>
            ))}

          <HTile
            pic={require('../assets/myreport.png')}
            title="My health report"
            sub="Library of all health records and documents"
            pressButton={text => navigation.navigate('MyReport')}
          />
          <HTile
            pic={require('../assets/addreport.png')}
            title="Add health data"
            sub="Fill in your lab test result for statistic report and health tracking"
            pressButton={uploadReportManual}
          />
          <HTile
            pic={require('../assets/uploadreport.png')}
            title="Upload health report"
            sub="Store your health document in our encrypted HealthDoc"
            pressButton={uploadReport}
          />

          <View style={{marginBottom: 100}}></View>
        </ScrollView>
        <BottomTabNavigator />

        {/* <View style={{backgroundColor: 'white'}}>
        <Text>My Report</Text>
      </View> */}
      </SafeAreaView>
      <CustomDialog
        visible={alertVisible}
        message="You have reached your limit. Kindly upgrade your membership to continue using this service."
        buttonText1="Ok"
        onpressButton1={() => {
          setalertVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
