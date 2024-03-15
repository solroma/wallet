import { useEffect, useRef } from 'react';

import { WalletConnectModal } from '@walletconnect/modal';

import type { IAppEventBusPayload } from '@onekeyhq/shared/src/eventBus/appEventBus';
import {
  EAppEventBusNames,
  appEventBus,
} from '@onekeyhq/shared/src/eventBus/appEventBus';
import { WALLET_CONNECT_V2_PROJECT_ID } from '@onekeyhq/shared/src/walletConnect/constant';

export function WalletConnectModalContainer() {
  const modalRef = useRef<WalletConnectModal | null>(null);

  useEffect(() => {
    const open = async (
      p: IAppEventBusPayload[EAppEventBusNames.WalletConnectOpenModal],
    ) => {
      const { uri } = p;
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
  }, []);

  return null;
}
