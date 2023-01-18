import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
const {width} = Dimensions.get('window');
import {medium, light, bold, clickText} from '../Styles';

export default function TestModal({visible, tests, onSelect, onpressBack}) {
  return (
    <Modal
      onRequestClose={onpressBack}
      animationType="fade"
      transparent={true}
      visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
          paddingTop: 50,
        }}>
        <View
          style={{
            width: '100%',
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity style={{padding: 10}} onPress={onpressBack}>
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            paddingTop: 30,
            width: width - 100,
          }}>
          <FlatList
            data={tests}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index}
            renderItem={items => {
              return (
                <TouchableOpacity
                  style={styles.itemStyle}
                  onPress={() => {
                    onSelect(items.item);
                  }}>
                  <Text style={styles.itemText}>
                    {items.item.charAt(0).toUpperCase() + items.item.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
          <View style={{paddingVertical: 20}}></View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    backgroundColor: 'white',
    margin: 10,
    padding: 20,
    borderRadius: 16,
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
