import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

import { useNavigation, useRoute } from '@react-navigation/core';

import {
  Box,
  Modal,
  ScrollView,
  useIsVerticalLayout,
  useSafeAreaInsets,
} from '@onekeyhq/components';
import NavigationButton from '@onekeyhq/components/src/Modal/Container/Header/NavigationButton';
import { isAllNetworks } from '@onekeyhq/engine/src/managers/network';
import { migrateNFTItemFields } from '@onekeyhq/engine/src/managers/nft';
import type { CollectiblesRoutesParams } from '@onekeyhq/kit/src/routes/Root/Modal/Collectibles';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

import backgroundApiProxy from '../../../../background/instance/backgroundApiProxy';

import { getNFTDetailComponents } from './getNFTDetailComponents';

import type { CollectiblesModalRoutes } from '../../../../routes/routesEnum';
import type { IEVMNFTCollectionType, INFTListItem } from '../NFTList/type';
import type { RouteProp } from '@react-navigation/core';

function ModalContent({
  isOwner,
  asset,
  collection,
  accountId,
  networkId,
  onRecycleUtxo,
}: {
  asset: INFTListItem;
  collection?: IEVMNFTCollectionType['content'];
  networkId: string;
  accountId?: string;
  isOwner: boolean;
  onRecycleUtxo?: () => void;
}) {
  const isVertical = useIsVerticalLayout();
  const { ImageContent, DetailContent } = getNFTDetailComponents({ asset });
  const { bottom } = useSafeAreaInsets();
  if (isVertical || platformEnv.isNativeIOSPad) {
    return (
      <ScrollView p="16px">
        <ImageContent
          asset={asset.content}
          isOwner={isOwner}
          networkId={networkId}
        />
        <Box mt="24px" mb={bottom}>
          <DetailContent
            asset={asset.content}
            collection={collection}
            isOwner={isOwner}
            networkId={networkId}
            accountId={accountId}
            onRecycleUtxo={onRecycleUtxo}
          />
        </Box>
      </ScrollView>
    );
  }
  return (
    <Box flexDirection="row">
      <ImageContent
        asset={asset.content}
        isOwner={isOwner}
        networkId={networkId}
      />
      <ScrollView h="640px" p="24px">
        <DetailContent
          asset={asset.content}
          collection={collection}
          isOwner={isOwner}
          networkId={networkId}
          accountId={accountId}
          onRecycleUtxo={onRecycleUtxo}
        />
      </ScrollView>
    </Box>
  );
}

const NFTDetailModal: FC = () => {
  const [accountId, setAccountId] = useState<string | undefined>();
  const hardwareCancelFlagRef = useRef<boolean>(false);
  const navigation = useNavigation();

  const route =
    useRoute<
      RouteProp<
        CollectiblesRoutesParams,
        CollectiblesModalRoutes.NFTDetailModal
      >
    >();

  const {
    asset: assetOrigin,
    collection,
    isOwner,
    accountId: originAccountId,
    networkId,
    onRecycleUtxo,
  } = route.params;

  const asset = migrateNFTItemFields(assetOrigin);

  useEffect(() => {
    if (!isAllNetworks(networkId)) {
      setAccountId(originAccountId);
      return;
    }
    backgroundApiProxy.serviceAccount
      .getAccountByAddress({
        address: asset.content.accountAddress ?? '',
        networkId: asset.content.networkId,
      })
      .then((account) => {
        if (account) {
          setAccountId(account?.id);
        }
      });
  }, [asset, originAccountId, networkId]);

  return (
    <Modal
      size="2xl"
      height="640px"
      maxHeight="640px"
      footer={null}
      headerShown={false}
      staticChildrenProps={{ flex: 1 }}
    >
      <NavigationButton
        position="absolute"
        top={platformEnv.isExtensionUiPopup ? '8px' : '24px'}
        right={platformEnv.isExtensionUiPopup ? '8px' : '24px'}
        zIndex={1}
        onPress={() => {
          hardwareCancelFlagRef.current = true;
          navigation.goBack?.();
        }}
      />
      <ModalContent
        asset={asset}
        collection={collection}
        isOwner={isOwner}
        networkId={asset.content.networkId}
        accountId={accountId}
        onRecycleUtxo={onRecycleUtxo}
      />
    </Modal>
  );
};

export default NFTDetailModal;
