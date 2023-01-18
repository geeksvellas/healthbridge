import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import PushNotification, {Importance} from 'react-native-push-notification';
import {setSubscriber, setPin, setUserProfile} from '../functions/Details';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFCMToken();
  }
}

const getFCMToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log(fcmToken, 'the old Token');
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log(fcmToken, 'the new generated token');
        const {currentUser} = auth();
        firestore()
          .collection('notificationToken')
          .doc(currentUser.uid)
          .set(
            {
              token: firestore.FieldValue.arrayUnion(fcmToken),
            },
            {merge: true},
          )
          .then(() => {
            console.log('Token added!');
          });
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log(error, 'error raied in fcmToken');
    }
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notificaton caused app to open from background state:',
      remoteMessage.notification,
    );
  });
  setSubscriber(
    messaging().onMessage(async remoteMessage => {
      console.log('recieved in foreground', remoteMessage);
      PushNotification.localNotification({
        channelId: 'healthdoc-1232',
        autoCancel: true,
        title: remoteMessage.data.title,
        message: remoteMessage.data.body,
        vibrate: true,
        vibration: 300,
        playSound: true,
        soundName: 'default',
        icon: 'https://firebasestorage.googleapis.com/v0/b/healthbridgeprod.appspot.com/o/logo.png?alt=media&token=ee24fdfe-bc9a-4bc1-a2ac-ebb507e0f76b',
      });
    }),
  );
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to popen from quit state:',
          remoteMessage.notification,
        );
      }
    });
};
