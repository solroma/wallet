import { useEffect, useState } from 'react';

import axios from 'axios';

import type { IWallet } from '@onekeyhq/engine/src/types';
import type { Device } from '@onekeyhq/engine/src/types/device';

import backgroundApiProxy from '../../../../../../background/instance/backgroundApiProxy';

import type { IEVMNFTItemType } from '../../../NFTList/type';

const supportContentType = [
  'image/gif',
  'image/svg',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

function useDeviceMenu({
  wallet,
  asset,
}: {
  wallet: IWallet | undefined;
  asset: IEVMNFTItemType['content'];
}) {
  const [device, setDevice] = useState<Device | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    (async () => {
      if (!wallet || wallet.type !== 'hw') {
        return;
      }
      const url = asset?.metadata?.image;
      if (!url) {
        return;
      }
      const res = await axios.head(url);
      const contentType = res.headers['content-type'];
      if (!supportContentType.includes(contentType ?? '')) {
        return;
      }
      const hwDevice = await backgroundApiProxy.engine.getHWDeviceByWalletId(
        wallet.id,
      );
      if (hwDevice?.deviceType !== 'touch') {
        return;
      }
      setShowMenu(true);
      setDevice(hwDevice);
    })();
  }, [wallet, asset]);

  return {
    device,
    showMenu,
  };
}

export { useDeviceMenu };
