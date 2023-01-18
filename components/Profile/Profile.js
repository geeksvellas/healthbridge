import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform,
  Linking,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {medium, light, bold, clickText} from '../Styles';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import firestore from '@react-native-firebase/firestore';
import CustomButton from '../CustomButton';
import CustomDialog from '../utilities/CustomDialog';
import BottomTabNavigator from '../utilities/BottomTabNavigator';
import {getUserProfile, signOutMain} from '../functions/Details';

const {width, height} = Dimensions.get('window');

export default function Profile({navigation}) {
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(false);

  const onLogOut = () => {
    setloading(true);
  };
  const signOut = async () => {
    await signOutMain();
    navigation.replace('SignInContainer');
  };
  useEffect(() => {
    setUser(getUserProfile());
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor="#7fccf0" />
      <ScrollView>
        <Image
          style={{width: '100%', minHeight: 200, top: 0, position: 'absolute'}}
          resizeMode="cover"
          source={require('../../assets/pbg1.png')}
        />
        <View
          style={{
            flex: 1,
            marginTop: 180,
            backgroundColor: 'white',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 20,
          }}>
          {user && (
            <View style={{flex: 1}}>
              <Image
                source={
                  user.gender == 'male'
                    ? require('../../assets/icons/gender/male.png')
                    : require('../../assets/icons/gender/female.png')
                }
                style={{width: 100, height: 100, marginTop: -50}}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{flex: 1, paddingRight: 5}}>
                  <Text style={[bold, {fontSize: width / 15}]}>
                    {user.fname.charAt(0).toUpperCase() + user.fname.slice(1)}{' '}
                    {user.lname.charAt(0).toUpperCase() + user.lname.slice(1)}
                  </Text>
                  {/* <Text>{user.uname}</Text> */}
                  {/* <Text
                    style={[
                      clickText,
                      {fontWeight: '600', fontSize: width / 25},
                    ]}>
                    {user.member ? user.member.membershipType : 'BASIC'} MEMBER
                  </Text> */}
                  {/* <Text>{user.email}</Text>
                <Text>{user.phone}</Text> */}
                  <View style={{marginTop: 20}}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('UpgradeMembership')}
                      style={{
                        flexDirection: 'row',
                        paddingVertical: 20,
                        alignItems: 'center',
                      }}>
                      <Icon size={30} name="documents" color="#54D9D5" />
                      <Text
                        style={[
                          medium,
                          {fontSize: width / 25, marginLeft: 20},
                        ]}>
                        Membership
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          'https://healthbridge-intl.com/privacy-policy/',
                        )
                      }
                      style={{
                        flexDirection: 'row',
                        paddingVertical: 20,
                        alignItems: 'center',
                      }}>
                      <Icon size={30} name="document-text" color="#54D9D5" />
                      <Text
                        style={[
                          medium,
                          {fontSize: width / 25, marginLeft: 20},
                        ]}>
                        Privacy Policy
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        Linking.openURL(
                          'https://healthbridge-intl.com/terms-and-conditions/',
                        )
                      }
                      style={{
                        flexDirection: 'row',
                        paddingVertical: 20,
                        alignItems: 'center',
                      }}>
                      <Icon size={30} name="documents" color="#54D9D5" />
                      <Text
                        style={[
                          medium,
                          {fontSize: width / 25, marginLeft: 20},
                        ]}>
                        Terms of Service
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('EditProfile')}>
                    <Text
                      style={[
                        clickText,
                        {
                          backgroundColor: '#54D9D5',
                          // height: 40,
                          color: '#fff',
                          paddingVertical: 10,
                          paddingHorizontal: 20,
                          borderRadius: 10,
                          // height: 40,
                          fontSize: width / 30,
                          marginRight: 10,
                          textAlignVertical: 'center',
                          ...Platform.select({
                            ios: {
                              overflow: 'hidden',
                            },
                          }),
                        },
                      ]}>
                      Edit
                    </Text>
                  </TouchableOpacity>
                  {/* <TouchableOpacity
                    onPress={() => navigation.navigate('Settings')}>
                    <Icon
                      style={{
                        borderRadius: 10,
                        padding: 12,
                        height: 40,
                        color: '#fff',
                        backgroundColor: '#54D9D5',
                        ...Platform.select({
                          ios: {
                            overflow: 'hidden',
                          },
                        }),
                      }}
                      name="settings-sharp"
                      size={width / 30}
                    />
                  </TouchableOpacity> */}
                </View>
              </View>
              <View
                style={{
                  alignItems: 'center',
                }}>
                <CustomButton pressButton={onLogOut}>Log Out</CustomButton>
                <Text style={[light, {fontSize: width / 25}]}>ver 1.52</Text>
                <View style={{marginBottom: 100}}></View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <CustomDialog
        visible={loading}
        onpressButton2={() => setloading(false)}
        onpressButton1={signOut}
        message="Are you sure you want to log out?"
        buttonText1="Yes"
        buttonText2="No,bring me back"
      />
      <BottomTabNavigator active="user" />
    </View>
  );
}

const styles = StyleSheet.create({});
