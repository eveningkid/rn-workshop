import React from 'react';
import { Platform, View } from 'react-native';

let createBottomTabNavigator = Platform.OS === 'ios' ? 
  require('react-navigation').createBottomTabNavigator : 
  require('react-navigation-material-bottom-tabs').createMaterialBottomTabNavigator;

class TemporaryView extends React.Component {
  render() {
    return <View style={{ flex: 1 }} />;
  }
}

export default TemporaryView;