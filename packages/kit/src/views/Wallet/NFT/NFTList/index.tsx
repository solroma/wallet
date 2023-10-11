import type { FC } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';

import { useIntl } from 'react-intl';

import {
  Box,
  Empty,
  HStack,
  IconButton,
  VStack,
  useIsVerticalLayout,
} from '@onekeyhq/components';
import { Tabs } from '@onekeyhq/components/src/CollapsibleTabView';
import { DebugRenderTracker } from '@onekeyhq/components/src/DebugRenderTracker';
import type { FlatListProps } from '@onekeyhq/components/src/FlatList';
import { isCollectibleSupportedChainId } from '@onekeyhq/engine/src/managers/nft';
import { useActiveWalletAccount } from '@onekeyhq/kit/src/hooks';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

import backgroundApiProxy from '../../../../background/instance/backgroundApiProxy';
import { useShouldHideInscriptions } from '../../../../hooks/crossHooks/useShouldHideInscriptions';
import { usePromiseResult } from '../../../../hooks/usePromiseResult';
import { setHideInscriptions } from '../../../../store/reducers/settings';
import { navigateToNFTCollection, navigateToNFTDetail } from '../utils';

import { useNFTListNumColumns, useRecycleUtxos } from './hooks';
import NFTListHeader from './NFTListHeader';
import { NFTListItemComp } from './NFTListItemComp';
import { withProviderNFTList } from './overviewNFTContext';
import { ENFTDisplayType } from './type';

import type { INFTListItem } from './type';

export type IAccountNFTListDataFromSimpleDBOptions = {
  networkId: string;
  accountId: string;
};

type IEmptyProps = IAccountNFTListDataFromSimpleDBOptions & {
  fetchData: () => Promise<unknown>;
  isLoading: boolean;
};

const EmptyView: FC<IEmptyProps> = ({
  networkId,
  accountId,
  fetchData,
  isLoading,
}) => {
  const intl = useIntl();
  const isNFTSupport = isCollectibleSupportedChainId(networkId);
  const shouldHideInscriptions = useShouldHideInscriptions({
    accountId,
    networkId,
  });

  if (!isNFTSupport) {
    return (
      <Empty
        pr="16px"
        emoji="🖼️"
        title={intl.formatMessage({ id: 'empty__not_supported' })}
        subTitle={intl.formatMessage({ id: 'empty__not_supported_desc' })}
      />
    );
  }

  if (shouldHideInscriptions) {
    return (
      <Empty
        pr="16px"
        emoji="🖼️"
        title={intl.formatMessage({
          id: 'asset__collectibles_empty_title',
        })}
        subTitle={intl.formatMessage({
          id: 'asset__collectibles_empty_desc',
        })}
        actionTitle={intl.formatMessage({
          id: 'action__restore_inscriptions',
        })}
        actionProps={{
          type: 'basic',
        }}
        handleAction={() =>
          backgroundApiProxy.dispatch(
            setHideInscriptions({
              [accountId]: false,
            }),
          )
        }
      />
    );
  }

  return (
    <Empty
      pr="16px"
      emoji="🖼️"
      title={intl.formatMessage({
        id: 'asset__collectibles_empty_title',
      })}
      subTitle={intl.formatMessage({
        id: 'asset__collectibles_empty_desc',
      })}
      actionTitle={intl.formatMessage({ id: 'action__refresh' })}
      handleAction={fetchData}
      isLoading={isLoading}
    />
  );
};
const MemoEmpty = memo(EmptyView);

const pageSize = 100;

const NFTListContainer: FC = () => {
  const intl = useIntl();
  const isVertical = useIsVerticalLayout();
  const { numColumns } = useNFTListNumColumns();
  const [page, setPage] = useState(1);
  const { accountId, networkId } = useActiveWalletAccount();
  const { recycleUtxos } = useRecycleUtxos({
    networkId,
    accountId,
  });

  const { result, isLoading, run } = usePromiseResult(
    () =>
      backgroundApiProxy.serviceNFT.fetchAccountNFTCollections({
        networkId,
        accountId,
        page,
        pageSize,
      }),
    [networkId, accountId, page],
    {
      debounced: 600,
      watchLoading: true,
    },
  );

  const shouldHideInscriptions = useShouldHideInscriptions({
    accountId,
    networkId,
  });

  const { collections, hasMore } = useMemo(() => {
    if (!result) {
      return {
        collections: [],
        hasMore: false,
      };
    }
    const list = result.data.filter((d) => {
      if (d.type !== ENFTDisplayType.ORDINALS_ITEM) {
        return true;
      }
      if (shouldHideInscriptions) {
        return false;
      }
      if (
        !recycleUtxos.find((utxo) => {
          const [txId, vout] = utxo.key.split('_');
          const [assetTxId, assetVout] = d.content.output.split(':');
          return assetTxId === txId && assetVout === vout;
        })
      ) {
        return true;
      }
      return false;
    });
    return {
      collections: list,
      hasMore: result.pagination.hasNext && list.length > 0,
    };
  }, [result, recycleUtxos, shouldHideInscriptions]);

  const onSelect = useCallback(
    (item: INFTListItem) => {
      const { type, content } = item;
      console.log('onSelect', type, content, item);
      if (!accountId || !networkId) return;
      switch (type) {
        case ENFTDisplayType.EVM_COLLECTION:
          navigateToNFTCollection({
            networkId,
            accountId,
            collection: content,
          });
          break;
        case ENFTDisplayType.ORDINALS_ITEM:
          navigateToNFTDetail({
            networkId,
            accountId,
            asset: {
              type: ENFTDisplayType.ORDINALS_ITEM,
              content,
            },
          });
          break;
        default:
          break;
      }
    },
    [accountId, networkId],
  );

  const renderItem = useCallback<
    NonNullable<FlatListProps<INFTListItem>['renderItem']>
  >(
    ({ item }) => (
      <DebugRenderTracker>
        <NFTListItemComp {...item} onSelect={() => onSelect(item)} />
      </DebugRenderTracker>
    ),
    [onSelect],
  );

  const handleLoadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const loadMore = useMemo(() => {
    const button = hasMore ? (
      <HStack justifyContent="center">
        <IconButton
          name="ChevronDownMini"
          w={isVertical ? 'full' : '130px'}
          onPress={handleLoadMore}
        >
          {intl.formatMessage({ id: 'action__load_more' })}
        </IconButton>
      </HStack>
    ) : null;
    return (
      <VStack pr="4">
        {button}
        <Box h="24px" w="full" />
      </VStack>
    );
  }, [intl, isVertical, handleLoadMore, hasMore]);

  const keyExtractor = useCallback(
    ({ type, content }: INFTListItem, index: number) => {
      switch (type) {
        case ENFTDisplayType.EVM_COLLECTION:
          return `${content.collectionId}_${content.collectionType}`;
        case ENFTDisplayType.EVM_ITEM:
          return `${content.collectionId}_${content.collectionType}_${content.itemId}`;
        case ENFTDisplayType.ORDINALS_ITEM:
          return `${content.inscription_id}_${content.inscription_number}_${content.type}`;
        default:
          return `${index}`;
      }
    },
    [],
  );

  return (
    <Tabs.FlatList
      contentContainerStyle={{
        paddingLeft: 16,
        paddingBottom: collections.length ? 16 : 0,
        marginTop: 24,
      }}
      key={
        platformEnv.isNative && !platformEnv.isNativeIOSPad
          ? undefined
          : `NFTList${numColumns}`
      }
      data={collections}
      renderItem={renderItem}
      ListFooterComponent={loadMore}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <MemoEmpty
          accountId={accountId}
          networkId={networkId}
          fetchData={run}
          isLoading={isLoading ?? false}
        />
      }
      numColumns={numColumns}
      ListHeaderComponent={<NFTListHeader />}
      keyExtractor={keyExtractor}
    />
  );
};

export default memo(withProviderNFTList(NFTListContainer));
