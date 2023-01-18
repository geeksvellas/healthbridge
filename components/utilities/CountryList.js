import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {countryList} from '../ListOfCountries';

const {width} = Dimensions.get('window');
export default function CountryList({visible, onSelect, showIcons}) {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      {/* <Text>Modal</Text> */}
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          flex: 1,
          justifyContent: 'center',
        }}>
        <FlatList
          data={countryList}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            justifyContent: 'center',
            paddingHorizontal: 20,
            flex: 1,
          }}
          renderItem={(items, index) => {
            return (
              <TouchableOpacity
                style={styles.itemStyle}
                onPress={() => onSelect(items.item)}>
                {showIcons && (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      source={items.item.icon}
                      resizeMode="contain"
                      style={{height: 40, width: 40}}
                    />
                    <Text style={styles.itemText}>{items.item.cc}</Text>
                  </View>
                )}
                <Text style={styles.itemText}>{items.item.name}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    backgroundColor: 'white',
    margin: 5,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemText: {
    ...Platform.select({
      ios: {
        fontFamily: 'Trebuchet MS',
      },
      android: {
        fontFamily: 'Rubik-Medium',
      },
    }),
    fontSize: width / 20,
    paddingHorizontal: 10,
  },
});
