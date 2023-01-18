import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function ProgressBar({step, max}) {
  return (
    <View style={{flexDirection: 'row', paddingVertical: 30}}>
      <View
        style={{
          backgroundColor: '#BBF7FF',
          flexDirection: 'row',
          width: 200,
          borderRadius: 10,
        }}>
        <View
          style={{
            backgroundColor: '#54D9D5',
            height: 10,
            flex: step / max,
            borderRadius: 10,
          }}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
