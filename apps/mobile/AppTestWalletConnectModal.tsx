/* eslint-disable import/order */
import '@onekeyhq/shared/src/polyfills';
import '@walletconnect/react-native-compat';

/* eslint-disable @typescript-eslint/no-use-before-define */
import { useState } from 'react';

import bufferUtils from '@onekeyhq/shared/src/utils/bufferUtils';
import {
  WALLET_CONNECT_CLIENT_META,
  WALLET_CONNECT_V2_PROJECT_ID,
} from '@onekeyhq/shared/src/walletConnect/constant';

import {
  WalletConnectModal,
  useWalletConnectModal,
} from '@walletconnect/modal-react-native';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const sessionParams = {
  namespaces: {
    eip155: {
      methods: ['eth_sendTransaction', 'personal_sign'],
      chains: ['eip155:1'],
      events: ['chainChanged', 'accountsChanged'],
      rpcMap: {},
    },
  },
};

function App(): JSX.Element {
  const { isConnected, provider, open } = useWalletConnectModal();
  const [modalVisible, setModalVisible] = useState(false);
  const [rpcResponse, setRpcResponse] = useState<any>();
  const [loading, setLoading] = useState(false);

  const onConnect = () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    return open({
      //   route?: 'ConnectWallet' | 'Qrcode' | 'WalletExplorer';
      route: 'ConnectWallet',
    });
  };

  const onCopy = (value: string) => {
    console.log('Copied to clipboard:', value);
  };

  const onResponse = (response: any) => {
    setRpcResponse(response);
    setLoading(false);
  };

  const onModalClose = () => {
    setModalVisible(false);
    setLoading(false);
    setRpcResponse(undefined);
  };

  const onAction = (callback: any) => async () => {
    try {
      setLoading(true);
      setModalVisible(true);
      //   const response = await callback();
      //   onResponse(response);
    } catch (error: any) {
      //   onResponse({
      //     error: error?.message || 'error',
      //   });
    }
  };

  const onSendTransaction = async () => {
    if (!provider) {
      return;
    }

    const chainId = await provider.request({
      method: 'eth_chainId',
    });
    const amount = 0;

    const accounts: string[] | undefined = await provider?.request({
      method: 'eth_accounts',
    });

    if (!accounts) {
      return;
    }

    const address = accounts[0];

    const transaction = {
      from: address,
      to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045', // vitalik.eth
      value: amount,
      chainId,
      data: '0x',
    };

    const txResponse = await provider.request({
      method: 'eth_sendTransaction',
      params: [transaction],
    });

    return {
      method: 'send transaction',
      result: txResponse,
    };
  };

  const onSignMessage = async () => {
    if (!provider) {
      return;
    }

    const accounts: string[] | undefined = await provider?.request({
      method: 'eth_accounts',
    });

    if (!accounts) {
      return;
    }

    const address = accounts[0];

    const message = bufferUtils.textToHex('Hello World!', 'utf-8');
    const signature = await provider.request({
      method: 'personal_sign',
      params: [message, address],
    });

    return {
      method: 'sign message',
      signature,
    };
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onConnect}>
          <Text style={styles.buttonText}>
            {isConnected ? 'Disconnect' : 'Connect'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isConnected && styles.buttonDisabled]}
          disabled={!isConnected}
          onPress={onAction(onSendTransaction)}
        >
          <Text style={styles.buttonText}>Send Transaction</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isConnected && styles.buttonDisabled]}
          disabled={!isConnected}
          onPress={onAction(onSignMessage)}
        >
          <Text style={styles.buttonText}>Sign Message</Text>
        </TouchableOpacity>
      </View>
      <WalletConnectModal
        projectId={WALLET_CONNECT_V2_PROJECT_ID}
        providerMetadata={WALLET_CONNECT_CLIENT_META}
        sessionParams={sessionParams}
        onCopyClipboard={onCopy}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3396FF',
    borderRadius: 20,
    width: 200,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
  },
});

export default App;
