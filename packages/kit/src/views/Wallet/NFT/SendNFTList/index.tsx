import { useCallback, useEffect, useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useIntl } from 'react-intl';

import {
  Box,
  Button,
  FlatList,
  Spinner,
  Text,
  useSafeAreaInsets,
} from '@onekeyhq/components';
import type { FlatListProps } from '@onekeyhq/components/src/FlatList';
import { batchTransferContractAddress } from '@onekeyhq/engine/src/presets/batchTransferContractAddress';
import type { IErcNftType } from '@onekeyhq/engine/src/types/nft';
import { IMPL_SOL } from '@onekeyhq/shared/src/engine/engineConsts';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

import backgroundApiProxy from '../../../../background/instance/backgroundApiProxy';
import { useActiveSideAccount } from '../../../../hooks';
import { useGridListLayout } from '../../../../hooks/useGridListLayout';
import {
  ModalRoutes,
  RootRoutes,
  SendModalRoutes,
} from '../../../../routes/routesEnum';
import { ENFTCollectionType } from '../NFTList/type';

import SelectNFTCard from './SelectNFTCard';
import { SendNFTContentProvider, useSendNFTContent } from './SendNFTContent';

import type { SendRoutesParams } from '../../../../routes';
import type { ModalScreenProps } from '../../../../routes/types';
import type { PreSendParams } from '../../../Send/types';
import type { IEVMNFTItemType } from '../NFTList/type';
import type { SelectAsset } from './SendNFTContent';

type NavigationProps = ModalScreenProps<SendRoutesParams>;

function List({
  accountId,
  networkId,
  onGetMore,
}: {
  accountId: string;
  networkId: string;
  onGetMore?: () => void;
}) {
  const content = useSendNFTContent();
  const { listData } = content?.context ?? { listData: [] };
  const [pageWidth, setPageWidth] = useState<number>(0);
  const { cardWidth, numColumns } = useGridListLayout({
    maxCardWidth: 112,
    numColumns: 3,
    margin: 8,
    pageWidth,
  });

  const renderItem = useCallback<
    NonNullable<FlatListProps<SelectAsset>['renderItem']>
  >(
    ({ item }) => (
      <SelectNFTCard
        accountId={accountId}
        networkId={networkId}
        cardWidth={cardWidth}
        key={item.itemId}
        marginRight="8px"
        asset={item}
      />
    ),
    [accountId, cardWidth, networkId],
  );

  return (
    <FlatList
      onLayout={(e) => {
        if (pageWidth !== e.nativeEvent.layout.width) {
          setPageWidth(e.nativeEvent.layout.width);
        }
      }}
      key={numColumns}
      numColumns={numColumns}
      data={listData}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      py="24px"
      onEndReached={onGetMore}
    />
  );
}

function SendButton({
  accountId,
  networkId,
}: {
  accountId: string;
  networkId: string;
}) {
  const content = useSendNFTContent();
  const { bottom } = useSafeAreaInsets();
  const intl = useIntl();
  const navigation = useNavigation<NavigationProps['navigation']>();

  const listData = content?.context.listData ?? [];
  const multiSelect = content?.context.multiSelect;
  if (listData.length === 0) {
    return null;
  }

  const selectNFTs = listData.filter((item) => item.selected === true);
  const isDisabled = selectNFTs.length === 0;

  const transferInfos = selectNFTs.map((item) => ({
    from: '',
    to: '',
    isNFT: true,
    amount: item.selectAmount ?? '1',
    token: item.collectionId,
    nftTokenId: item.itemId,
    nftType: (item.collectionType === ENFTCollectionType.ERC721
      ? 'erc721'
      : 'erc1155') as IErcNftType,
  }));

  const sendAction = () => {
    const params: PreSendParams = {
      ...transferInfos[0],
      accountId,
      networkId,
      transferInfos,
    };
    navigation.navigate(RootRoutes.Modal, {
      screen: ModalRoutes.Send,
      params: {
        screen: SendModalRoutes.PreSendAddress,
        params,
      },
    });
  };

  return (
    <Box pt="16px" pb={{ base: `${16 + bottom}px`, md: '24px' }}>
      <Button
        isDisabled={isDisabled}
        size={platformEnv.isNative ? 'xl' : 'lg'}
        type="primary"
        onPress={sendAction}
      >
        {multiSelect && selectNFTs.length > 0
          ? intl.formatMessage(
              {
                id: 'action__send_count_nfts',
              },
              { count: selectNFTs.length },
            )
          : intl.formatMessage({
              id: 'action__send_nft',
            })}
      </Button>
    </Box>
  );
}

const pageSize = 100;

function SendNFTList({
  accountId,
  networkId,
}: {
  accountId: string;
  networkId: string;
}) {
  const intl = useIntl();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState<IEVMNFTItemType['content'][]>([]);
  const { network, accountAddress } = useActiveSideAccount({
    networkId,
    accountId,
  });
  const multiSelect = Boolean(
    network &&
      (batchTransferContractAddress[network.id] || network.impl === IMPL_SOL),
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res =
        await backgroundApiProxy.serviceNFT.fetchAccountNFTCollectionItems({
          networkId,
          address: accountAddress,
          page,
          pageSize,
        });

      if (!res.pagination.hasNext) {
        setHasMore(false);
      }
      setItems((prev) => [...prev, ...res.data.map((n) => n.content)]);
    } catch (e) {
      // pass
    }
    setLoading(false);
  }, [accountAddress, networkId, page]);

  const handleGetMore = useCallback(() => {
    if (!hasMore) return;
    setPage((p) => p + 1);
  }, [hasMore]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return items.length > 0 ? (
    <SendNFTContentProvider listData={items} multiSelect={multiSelect}>
      <List
        accountId={accountId}
        networkId={networkId}
        onGetMore={handleGetMore}
      />
      <SendButton accountId={accountId} networkId={networkId} />
    </SendNFTContentProvider>
  ) : (
    <Box flex={1} justifyContent="center" alignItems="center">
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <>
          <Text typography="Display2XLarge" fontSize={48} lineHeight={60}>
            🖼️
          </Text>
          <Text typography="DisplayMedium" mt="12px">
            {intl.formatMessage({ id: 'empty__no_nfts' })}
          </Text>
        </>
      )}
    </Box>
  );
}

export default SendNFTList;
