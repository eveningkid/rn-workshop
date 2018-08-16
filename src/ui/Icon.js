import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default class Icon extends React.Component {
  render() {
    const isIOS = Platform.OS === 'ios';
    const prefix = `${isIOS ? 'ios' : 'md'}-`;
    const suffix = isIOS ? '-outline' : '';
    const { name, ...props } = this.props;
    return <Ionicons name={prefix + name + suffix} {...props} />;
  }
}
