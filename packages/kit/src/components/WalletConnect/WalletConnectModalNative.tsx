/* eslint-disable import/order */
import '@walletconnect/react-native-compat';

import { Button } from '@onekeyhq/components';
import type { IAppEventBusPayload } from '@onekeyhq/shared/src/eventBus/appEventBus';
import {
  EAppEventBusNames,
  appEventBus,
} from '@onekeyhq/shared/src/eventBus/appEventBus';
import platformEnv from '@onekeyhq/shared/src/platformEnv';
import timerUtils from '@onekeyhq/shared/src/utils/timerUtils';
import {
  WALLET_CONNECT_CLIENT_META,
  WALLET_CONNECT_V2_PROJECT_ID,
} from '@onekeyhq/shared/src/walletConnect/constant';
import { ClientCtrl } from '@walletconnect/modal-react-native/src/controllers/ClientCtrl';
import { useWalletConnectModal } from '@walletconnect/modal-react-native/src/hooks/useWalletConnectModal';
import { WalletConnectModal } from '@walletconnect/modal-react-native/src/modal/wcm-modal';
import { useEffect } from 'react';

// https://docs.walletconnect.com/advanced/walletconnectmodal/usage
// https://github.com/WalletConnect/react-native-examples/blob/main/dapps/ModalUProvider/src/App.tsx
export function WalletConnectModalNative() {
  const { open: openNativeModal } = useWalletConnectModal();

  // TODO call ClientCtrl.setProvider first, then render Modal, openNativeModal
  console.log('NativeModal openNativeModal: ', openNativeModal);

  useEffect(() => {
    const open = async (
      p: IAppEventBusPayload[EAppEventBusNames.WalletConnectOpenModal],
    ) => {
      const { uri, provider } = p;

      console.log(
        'WalletConnectModalContainer show qrcode uri: ------------------------ ',
      );
      console.log(uri);
      console.log('------------------------');

      if (platformEnv.isNative) {
        if (!provider) {
          throw new Error(
            'WalletConnectModalNative init ERROR: provider is required',
          );
        }
        ClientCtrl.setProvider(provider);
        await timerUtils.wait(600);
        await openNativeModal();
        // await openNativeModal({
        //   route: 'ConnectWallet',
        // });
      }
    };
    const close = async () => {
      //
    };

    appEventBus.on(EAppEventBusNames.WalletConnectOpenModal, open);
    appEventBus.on(EAppEventBusNames.WalletConnectCloseModal, close);

    return () => {
      appEventBus.off(EAppEventBusNames.WalletConnectOpenModal, open);
      appEventBus.off(EAppEventBusNames.WalletConnectCloseModal, close);
    };
  }, [openNativeModal]);

  return (
    <>
      <WalletConnectModal
        projectId={WALLET_CONNECT_V2_PROJECT_ID}
        providerMetadata={WALLET_CONNECT_CLIENT_META}
      />
      <Button onPress={() => openNativeModal()}>Connect1</Button>
    </>
  );
}
