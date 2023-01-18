import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SignIn from './components/SignIn';
import ManualSignin from './components/ManualSignin';
import Home from './components/Home';
import Welcome from './components/Welcome';
import First from './components/Onboarding/First';
import Second from './components/Onboarding/Second';
import Third from './components/Onboarding/Third';
import Fourth from './components/Onboarding/Fourth';
import VerifyNumber from './components/VerifyNumber';
import EmailFill from './components/EmailFill';
import NameFill from './components/NameFill';
import GenderFill from './components/GenderFill';
import Telemedicine from './components/Telemedicine';
import VConsultation from './components/VConsultation';
import Specialists from './components/Specialists';
import Doctors from './components/Doctors';
import ReportDash from './components/ReportDash';
import AddLabReport from './components/AddLabReport';
import AddTests from './components/AddTests';
import UploadReport from './components/UploadReport';
import MyReport from './components/MyReport';
import Profile from './components/Profile/Profile';
import EditProfile from './components/Profile/EditProfile';
import Settings from './components/Profile/Settings';
import Connect from './components/Fitness/Connect';
import FitbitView from './components/Fitness/FitbitView';
import Disclaimer from './components/Fitness/Disclaimer';
import MyReportDetails from './components/MyReportDetails';
import DoctorCalendar from './components/DoctorCalendar';
import Symptoms from './components/Symptoms';
import VideoAppointment from './components/VideoAppointment';
import UsernameFill from './components/UsernameFill';
import PinFill from './components/PinFill';
import UpdatePhone from './components/UpdatePhone';
import Payment from './components/Payment';
import ShareTo from './components/ShareTo';
import Members from './components/Members';
import UnshareTo from './components/UnshareTo';
import ShareAppointmentMember from './components/ShareAppointmentMember';
import UpgradeMembership from './components/UpgradeMembership';
import AddMemberMembership from './components/AddMemberMembership';
import ShareMembership from './components/ShareMembership';
import AppointmentsModal from './components/AppointmentsModal';
import ShareReportMember from './components/ShareReportMember';
import LinkPhone from './components/LinkPhone';
import SplashScreen from 'react-native-splash-screen';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
const Stack = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();
const SignUpStack = createNativeStackNavigator();
const SignInStack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isNew, setisNew] = useState(true);
  const [isLoading, setisLoading] = useState(true);
  const [initialRoute, setinitialRoute] = useState(null);

  function onAuthStateChanged(user) {
    console.log(user, 'LoggedInUser');
    // setUser(user);
    if (user) {
      // setisLoggedIn(true);
    } else {
      setisLoading(false);
      setisLoggedIn(false);
      // navigation.navigate('SignInContainer');
    }
    // if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // auth().signOut();
    const {currentUser} = auth();
    if (currentUser) {
      console.log(currentUser);
      firestore()
        .collection('patient')
        .doc(currentUser.uid)
        .get()
        .then(documentSnapshot => {
          // console.log('User exists: ', documentSnapshot.exists);
          if (documentSnapshot.exists) {
            setisLoggedIn(true);
            setisNew(false);
            setinitialRoute('loggedInContainer');
          } else {
            setinitialRoute('firstLogIn');
            setisLoggedIn(true);
            setisNew(true);
          }
          SplashScreen.hide();
        });
    } else {
      setisLoading(false);
      setinitialRoute('SignInContainer');
      SplashScreen.hide();
    }
    // SplashScreen.hide();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // return subscriber; // unsubscribe on unmount
  }, []);

  const SignInContainer = ({navigation}) => {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} />
        <Stack.Screen name="Third" component={Third} />
        <Stack.Screen name="Fourth" component={Fourth} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="ManualSignin" component={ManualSignin} />
        {/* <Stack.Screen name="SignUp" component={SignUp} />*/}
        <Stack.Screen name="VerifyNumber" component={VerifyNumber} />
        {/* <Stack.Screen name="VerifySignUp" component={VerifySignUp} />  */}
      </Stack.Navigator>
    );
  };

  const loggedInContainer = ({navigation}) => {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          options={{title: 'Dashboard'}}
          name="Home"
          component={Home}
        />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="VerifyNumber" component={VerifyNumber} />
        <Stack.Screen name="Telemedicine" component={Telemedicine} />
        <Stack.Screen name="VConsultation" component={VConsultation} />
        <Stack.Screen name="Doctors" component={Doctors} />
        <Stack.Screen name="Specialists" component={Specialists} />
        <Stack.Screen name="DoctorCalendar" component={DoctorCalendar} />
        <Stack.Screen name="ReportDash" component={ReportDash} />
        <Stack.Screen name="AddLabReport" component={AddLabReport} />
        <Stack.Screen name="AddTests" component={AddTests} />
        <Stack.Screen name="UploadReport" component={UploadReport} />
        <Stack.Screen name="MyReport" component={MyReport} />
        <Stack.Screen name="MyReportDetails" component={MyReportDetails} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Connect" component={Connect} />
        <Stack.Screen name="Disclaimer" component={Disclaimer} />
        <Stack.Screen name="FitbitView" component={FitbitView} />
        <Stack.Screen name="Symptoms" component={Symptoms} />
        <Stack.Screen name="VideoAppointment" component={VideoAppointment} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Members" component={Members} />
        <Stack.Screen name="UpgradeMembership" component={UpgradeMembership} />
        <Stack.Screen name="ShareMembership" component={ShareMembership} />
        <Stack.Screen name="AppointmentsModal" component={AppointmentsModal} />
        <Stack.Screen name="UpdatePhone" component={UpdatePhone} />
        <Stack.Screen name="ShareTo" component={ShareTo} />
        <Stack.Screen name="ShareReportMember" component={ShareReportMember} />
        <Stack.Screen name="LinkPhone" component={LinkPhone} />
        <Stack.Screen name="UnshareTo" component={UnshareTo} />
        <Stack.Screen
          name="ShareAppointmentMember"
          component={ShareAppointmentMember}
        />
        <Stack.Screen
          name="AddMemberMembership"
          component={AddMemberMembership}
        />
      </Stack.Navigator>
    );
  };

  const firstLogIn = ({navigation}) => {
    return (
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="NameFill" component={NameFill} />
        <Stack.Screen name="GenderFill" component={GenderFill} />
        <Stack.Screen name="UsernameFill" component={UsernameFill} />
        <Stack.Screen name="EmailFill" component={EmailFill} />
        <Stack.Screen name="PinFill" component={PinFill} />
      </Stack.Navigator>
    );
  };
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6FA" />
      {initialRoute && (
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={initialRoute}
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="firstLogIn" component={firstLogIn} />
            <Stack.Screen
              name="loggedInContainer"
              component={loggedInContainer}
            />
            <Stack.Screen name="SignInContainer" component={SignInContainer} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
