/* eslint-disable import/first */
/* eslint-disable import/order */
const {
  markJsBundleLoadedTime,
} = require('@onekeyhq/shared/src/modules3rdParty/react-native-metrix');

markJsBundleLoadedTime();

import { registerRootComponent } from 'expo';

const { Text, View } = require('react-native');

// import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

registerRootComponent(() => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Hello OneKey</Text>
  </View>
));
