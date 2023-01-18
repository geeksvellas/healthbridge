import {Platform} from 'react-native';

export const container = {
  backgroundColor: '#F4F6FA',
  flex: 1,
  alignItems: 'center',
};
export const button = {
  backgroundColor: '#54D9D5',
  paddingVertical: 15,
  //   width: width * 0.7,
  borderRadius: 16,
};
export const buttonText = {
  color: 'white',
  textAlign: 'center',
};
export const clickText = {
  color: '#54D9D5',
};
export const errorText = {
  color: 'red',
};
export const dropShadow = {
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.8,
      shadowRadius: 2,
    },
    android: {
      elevation: 5,
    },
  }),
};
export const medium = {
  ...Platform.select({
    ios: {
      fontFamily: 'Trebuchet MS',
    },
    android: {
      fontFamily: 'Rubik-Medium',
    },
  }),
};
export const light = {
  ...Platform.select({
    ios: {
      fontFamily: 'Trebuchet MS',
    },
    android: {
      fontFamily: 'Rubik-Light',
    },
  }),
  color: '#969696',
};
export const bold = {
  ...Platform.select({
    ios: {
      fontFamily: 'Trebuchet MS',
    },
    android: {
      fontFamily: 'Rubik-Bold',
    },
  }),
};
export const inputBox = {};
export const font15 = {
  fontSize: 15,
};
