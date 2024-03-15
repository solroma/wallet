/* eslint-disable import/order */
import '@walletconnect/react-native-compat';
import { useEffect, useRef, useState } from 'react';

import { WalletConnectModal } from '@walletconnect/modal';

import { ClientCtrl } from '@walletconnect/modal-react-native/src/controllers/ClientCtrl';
import { useWalletConnectModal } from '@walletconnect/modal-react-native/src/hooks/useWalletConnectModal';
import { WalletConnectModal as WalletConnectModalNative } from '@walletconnect/modal-react-native/src/modal/wcm-modal';

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

// https://docs.walletconnect.com/advanced/walletconnectmodal/usage
// https://github.com/WalletConnect/react-native-examples/blob/main/dapps/ModalUProvider/src/App.tsx
function NativeModal() {
  const { open: openNativeModal } = useWalletConnectModal();

  // TODO call ClientCtrl.setProvider first, then render Modal, openNativeModal
  console.log('NativeModal openNativeModal: ', openNativeModal);
  return (
    <WalletConnectModalNative
      projectId={WALLET_CONNECT_V2_PROJECT_ID}
      providerMetadata={WALLET_CONNECT_CLIENT_META}
    />
  );
}

export function WalletConnectModalContainer() {
  const modalRef = useRef<WalletConnectModal | null>(null);
  const [shouldRenderNativeModal, setShouldRenderNativeModal] = useState(false);
  const { open: openNativeModal } = useWalletConnectModal();

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
        setShouldRenderNativeModal(true);
        await timerUtils.wait(600);
        await openNativeModal();
        // await openNativeModal({
        //   route: 'ConnectWallet',
        // });
      } else {
        if (!modalRef.current) {
          modalRef.current = new WalletConnectModal({
            projectId: WALLET_CONNECT_V2_PROJECT_ID,
          });
          modalRef.current.subscribeModal((state: { open: boolean }) =>
            appEventBus.emit(EAppEventBusNames.WalletConnectModalState, state),
          );
        }
        await modalRef.current.openModal({
          uri,
        });
      }
    };
    const close = async () => {
      if (modalRef.current) {
        modalRef.current.closeModal();
      }
      // do not set null, subscribeModal will trigger many times, there is no unsubscribe method
      // modalRef.current = null;
    };

    appEventBus.on(EAppEventBusNames.WalletConnectOpenModal, open);
    appEventBus.on(EAppEventBusNames.WalletConnectCloseModal, close);

    return () => {
      appEventBus.off(EAppEventBusNames.WalletConnectOpenModal, open);
      appEventBus.off(EAppEventBusNames.WalletConnectCloseModal, close);
    };
  }, [openNativeModal]);

  return shouldRenderNativeModal ? <NativeModal /> : null;
}
