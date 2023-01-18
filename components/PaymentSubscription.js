import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {
  initStripe,
  CardField,
  useConfirmPayment,
} from '@stripe/stripe-react-native';
import CustomButton from './CustomButton';
import CustomDialog from './utilities/CustomDialog';
import {firebase} from '@react-native-firebase/functions';
import {
  CreditCardInput,
  LiteCreditCardInput,
} from 'react-native-credit-card-input';
import config from '../config';
import auth from '@react-native-firebase/auth';
import Loader from './Loader';
import {getUserProfile, signOutMain} from './functions/Details';

export default function PaymentSubscription({
  cardVisible,
  setModalVisible,
  onConfirmPayment,
  onStartLoading,
  amount,
  productID,
}) {
  const [cardDetails, setCardDetails] = useState(null);
  const {confirmPayment, loading} = useConfirmPayment();
  const [alertVisible, setalertVisible] = useState(false);
  const [alertText, setalertText] = useState(null);
  const [loader, setloading] = useState(false);

  const handlePayPress = async () => {
    // console.log(cardDetails, 'hfhf');
    var user = getUserProfile();
    console.log('user', user);
    // onStartLoading();
    if (cardDetails && cardDetails.valid) {
      setloading(true);
      // onStartLoading();
      auth()
        .currentUser.getIdToken(true)
        .then(function (idToken) {
          firebase
            .app()
            .functions('asia-east2')
            .httpsCallable('createSubscription?token=' + idToken)({
              cardDetails: cardDetails.values,
              productID: productID,
            })
            .then(async responseJson => {
              console.log(responseJson);
              if (responseJson.data.clientSecret) {
                console.log(responseJson.data.clientSecret, 'fetch success');
                setModalVisible(false);
                setloading(false);
                // console.log('Success from promise', paymentIntent);
                onConfirmPayment(responseJson.data);
              } else {
                setloading(false);
                setalertText('Payment failed. Try again later');
                setTimeout(() => {
                  setalertVisible(true);
                }, 500);
              }
            })
            .catch(error => {
              setloading(false);
              console.log(error, 'fetch error');
              setalertText(error.message);
              setTimeout(() => {
                setalertVisible(true);
              }, 500);
            });
        })
        .catch(err => {
          setloading(false);
          console.log(err);
        });
    } else {
      setalertText('Invalid card details');
      setTimeout(() => {
        setalertVisible(true);
      }, 500);
    }
    // };
  };
  const onChange = data => {
    // console.log(data);
    setCardDetails(data);
  };
  const onOK = () => {
    setalertVisible(false);
    setModalVisible(false);
  };
  useEffect(() => {
    initStripe({
      publishableKey: config.stipe_publishable_key,
    });
  }, []);
  return (
    <Modal
      transparent={true}
      visible={cardVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}>
      <Loader visible={loader} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.4)',
              width: '100%',
              paddingHorizontal: 20,
            }}>
            <View
              style={{
                borderRadius: 16,
                backgroundColor: 'white',
                width: '100%',
                padding: 30,
                alignItems: 'center',
              }}>
              <Text style={{textAlign: 'center'}}>
                Please enter your card details to proceed to payment. This
                payment details would be used for auto-deduction at the time of
                membership renewal.
              </Text>
              <Text style={{textAlign: 'left'}}>
                Payment amount: {amount} SGD
              </Text>

              {/* <CreditCardInput onChange={onChange} /> */}

              <Image
                style={{
                  width: width * 0.7,
                  height: (width * 0.7) / 1,
                }}
                resizeMode="contain"
                source={require('../assets/card.png')}
              />

              <LiteCreditCardInput onChange={onChange} />

              {/* <CardField
                postalCodeEnabled={false}
                placeholder={{
                  number: '4242 4242 4242 4242',
                }}
                cardStyle={{
                  backgroundColor: '#D6D9E0',
                  textColor: '#000000',
                  borderRadius: 10,
                }}
                style={{
                  width: '100%',
                  height: 50,
                  marginVertical: 30,
                }}
                onFormComplete={cardDetails => {
                  console.log('card details Form', cardDetails);
                  // setCard(cardDetails);
                }}
                onCardChange={cardDetailsInput => {
                  // console.log('cardDetails', cardDetailsInput);
                  setCardDetails(cardDetailsInput);
                }}
                onFocus={focusedField => {
                  // console.log('focusField', focusedField);
                }}
              /> */}
              <CustomButton pressButton={handlePayPress}>
                Confirm & Pay Now
              </CustomButton>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
            <CustomDialog
              visible={alertVisible}
              message={alertText}
              buttonText1="Ok"
              onpressButton1={onOK}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({});
