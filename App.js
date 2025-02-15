import React, {useState, useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {Network} from './src/components/Network';
import NavigateProviders from './src/navigation';
import NetInfo from '@react-native-community/netinfo';
import {persistor, store} from './src/redux/Store';
import {View, ActivityIndicator} from 'react-native';

const App = () => {
  const [isInternetReachable, setIsInternetReachable] = useState(true);
  const internetCheck = () => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsInternetReachable(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  };

  useEffect(() => {
    SplashScreen.hide();
    internetCheck();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {bootstrapped => {
          if (bootstrapped) {
            return (
              <>
                {!isInternetReachable ? <Network /> : null}
                <NavigateProviders />
              </>
            );
          } else {
            return (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
                }}>
                <ActivityIndicator animating color="#f17316" size="large" />
              </View>
            );
          }
        }}
      </PersistGate>
    </Provider>
  );
};

export default App;
