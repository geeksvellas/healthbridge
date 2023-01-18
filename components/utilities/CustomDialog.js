import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
const {width} = Dimensions.get('window');
import {medium, light, bold, clickText} from '../Styles';

export default function CustomDialog({
  visible,
  buttonText1,
  buttonText2,
  onpressButton2,
  onpressButton1,
  message,
}) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}>
        <View
          style={{
            backgroundColor: '#54D9D5',
            padding: 20,
            borderRadius: 16,
            width: width - 30,
          }}>
          <Text style={[medium, {color: 'white', fontSize: width / 20}]}>
            {message}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: buttonText2 == null ? 'flex-end' : 'space-around',
              padding: 20,
            }}>
            {buttonText1 != null && (
              <TouchableOpacity onPress={onpressButton1}>
                <Text style={[medium, {color: 'white', fontSize: width / 20}]}>
                  {buttonText1}
                </Text>
              </TouchableOpacity>
            )}
            {buttonText2 != null && (
              <TouchableOpacity onPress={onpressButton2}>
                <Text style={[medium, {color: 'white', fontSize: width / 20}]}>
                  {buttonText2}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
