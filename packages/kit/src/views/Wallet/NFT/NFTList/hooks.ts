import { useCallback, useEffect, useState } from 'react';

import { useIsVerticalLayout, useUserDevice } from '@onekeyhq/components';
import { isAllNetworks } from '@onekeyhq/engine/src/managers/network';
import type { CoinControlItem } from '@onekeyhq/engine/src/types/utxoAccounts';
import { MAX_PAGE_CONTAINER_WIDTH } from '@onekeyhq/shared/src/config/appConfig';
import { isBTCNetwork } from '@onekeyhq/shared/src/engine/engineConsts';
import { AppUIEventBusNames } from '@onekeyhq/shared/src/eventBus/appUIEventBus';

import backgroundApiProxy from '../../../../background/instance/backgroundApiProxy';
import { useAccount } from '../../../../hooks';
import { useShouldHideInscriptions } from '../../../../hooks/crossHooks/useShouldHideInscriptions';
import { useOnUIEventBus } from '../../../../hooks/useOnUIEventBus';
import { appSelector } from '../../../../store';

export const useNFTListNumColumns = () => {
  const isSmallScreen = useIsVerticalLayout();
  const { screenWidth } = useUserDevice();
  const MARGIN = isSmallScreen ? 16 : 20;
  const pageWidth = isSmallScreen
    ? screenWidth
    : Math.min(MAX_PAGE_CONTAINER_WIDTH, screenWidth - 224);

  const padding = isSmallScreen ? 8 : 12;
  const width = isSmallScreen
    ? Math.floor((screenWidth - MARGIN * 3) / 2)
    : 177;

  const contentSize = width - 2 * padding;

  const numColumns = isSmallScreen ? 2 : Math.floor(pageWidth / (177 + MARGIN));

  return {
    width,
    padding,
    numColumns,
    contentSize,
  };
};

export const useRecycleUtxos = ({
  networkId,
  accountId,
}: {
  networkId: string;
  accountId: string;
}) => {
  const { account } = useAccount({
    networkId,
    accountId,
  });
  const shouldHideInscriptions = useShouldHideInscriptions({
    accountId,
    networkId,
  });

  const [recycleUtxos, setRecycleUtxos] = useState<CoinControlItem[]>([]);

  const fetchCoinControlList = useCallback(async () => {
    let archivedUtxos: CoinControlItem[] = [];
    if (networkId) {
      if (isAllNetworks(networkId)) {
        const networkAccountsMap =
          appSelector((s) => s.overview.allNetworksAccountsMap)?.[accountId] ||
          {};

        for (const [nid, accounts] of Object.entries(
          networkAccountsMap ?? {},
        )) {
          const xpubs: string[] = [];

          if (isBTCNetwork(nid)) {
            xpubs.push(...accounts.map((item) => item.xpub).filter(Boolean));

            archivedUtxos = archivedUtxos.concat(
              await backgroundApiProxy.serviceUtxos.getArchivedUtxos(
                nid,
                xpubs,
              ),
            );
          }
        }
      } else if (account?.xpub) {
        archivedUtxos = await backgroundApiProxy.serviceUtxos.getArchivedUtxos(
          networkId,
          [account.xpub],
        );
      }
      setRecycleUtxos(archivedUtxos.filter((utxo) => utxo.recycle));
    }
  }, [account?.xpub, accountId, networkId]);

  useOnUIEventBus(
    AppUIEventBusNames.InscriptionRecycleChanged,
    fetchCoinControlList,
  );

  useEffect(() => {
    if (shouldHideInscriptions) return;
    fetchCoinControlList();
  }, [fetchCoinControlList, shouldHideInscriptions]);

  return {
    recycleUtxos,
    fetchCoinControlList,
  };
};
