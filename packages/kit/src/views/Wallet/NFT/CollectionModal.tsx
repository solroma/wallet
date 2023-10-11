import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { useRoute } from '@react-navigation/core';

import {
  Box,
  Modal,
  NetImage,
  Typography,
  useIsVerticalLayout,
  useUserDevice,
} from '@onekeyhq/components';
import RecyclerListView, {
  DataProvider,
  LayoutProvider,
} from '@onekeyhq/components/src/RecyclerListView';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import { usePromiseResult } from '../../../hooks/usePromiseResult';

import NFTListAssetCard from './NFTList/NFTListAssetCard';
import { ENFTDisplayType } from './NFTList/type';
import { navigateToNFTDetail } from './utils';

import type { CollectiblesRoutesParams } from '../../../routes/Root/Modal/Collectibles';
import type { CollectiblesModalRoutes } from '../../../routes/routesEnum';
import type { IEVMNFTCollectionType, IEVMNFTItemType } from './NFTList/type';
import type { RouteProp } from '@react-navigation/native';

const ViewTypes = {
  LOGO: 0,
  NAME: 1,
  DESC: 2,
  NFTCard: 3,
  Other: 4,
};

type ListDataType = {
  viewType: number;
  data?: string | IEVMNFTItemType['content'] | null;
}[];

function generateListArray(
  originData: IEVMNFTCollectionType['content'],
  items: IEVMNFTItemType[],
): ListDataType {
  let result: ListDataType = [];
  if (originData?.logoURI) {
    result.push({
      viewType: ViewTypes.LOGO,
      data: originData.logoURI,
    });
  }

  result.push({
    viewType: ViewTypes.NAME,
    data: originData.name,
  });
  result = result.concat(
    items.map((item) => ({
      viewType: ViewTypes.NFTCard,
      data: item.content,
    })),
  );
  return result;
}

const CollectionModal: FC = () => {
  const isSmallScreen = useIsVerticalLayout();

  const { screenWidth } = useUserDevice();
  const margin = isSmallScreen ? 16 : 20;
  const padding = 16;
  const pageWidth = isSmallScreen ? screenWidth : 800;

  const cardWidth = isSmallScreen
    ? Math.floor((pageWidth - padding * 2 - margin) / 2)
    : 177;

  const cardInnerPadding = isSmallScreen ? 8 : 12;
  const imageWidth = cardWidth - 2 * cardInnerPadding;
  const cardHeight = imageWidth + cardInnerPadding + 56;

  const route =
    useRoute<
      RouteProp<
        CollectiblesRoutesParams,
        CollectiblesModalRoutes.CollectionModal
      >
    >();
  const { collectible, networkId, accountId } = route.params;

  // Open Asset detail modal
  const handleSelectAsset = useCallback(
    (asset: IEVMNFTItemType['content']) => {
      navigateToNFTDetail({
        networkId,
        accountId,
        collection: collectible,
        asset: {
          type: ENFTDisplayType.EVM_ITEM,
          content: asset,
        },
      });
    },
    [accountId, networkId, collectible],
  );

  const { result: items } = usePromiseResult(
    () =>
      backgroundApiProxy.serviceNFT.fetchAccountNFTCollectionItems({
        networkId: collectible.networkId,
        address: collectible.accountAddress,
        collectionId: collectible.collectionId,
        page: 1,
        pageSize: 100,
      }),
    [collectible],
    {
      watchLoading: true,
    },
  );

  const listData = generateListArray(collectible, items?.data ?? []);
  const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
    listData,
  );

  const [descH, setDescH] = useState(1000);
  const layoutProvider = useMemo(
    () =>
      new LayoutProvider(
        (index) => {
          const data = listData[index];
          return data.viewType;
        },
        (type, dim) => {
          switch (type) {
            case ViewTypes.LOGO:
              dim.width = pageWidth - padding * 2;
              dim.height = collectible.logoURI ? 56 + 8 : 0;
              break;
            case ViewTypes.NAME:
              dim.width = pageWidth - padding * 2;
              dim.height = collectible.name ? 52 : 0;
              break;
            case ViewTypes.DESC:
              dim.width = pageWidth - 2 * padding;
              dim.height = 24 + (collectible.description ? descH : 0);
              break;
            case ViewTypes.NFTCard:
              dim.width = cardWidth + margin;
              dim.height = cardHeight + margin;
              break;
            default:
              dim.width = 0;
              dim.height = 0;
          }
        },
      ),
    [
      cardHeight,
      cardWidth,
      collectible.description,
      collectible.logoURI,
      collectible.name,
      descH,
      listData,
      margin,
      pageWidth,
    ],
  );

  const rowRenderer = useCallback(
    (type, item, index) => {
      const { data } = item;
      switch (type) {
        case ViewTypes.LOGO:
          if (data) {
            return (
              <Box alignItems="center">
                <NetImage
                  src={data}
                  width="56px"
                  height="56px"
                  borderRadius="28px"
                />
              </Box>
            );
          }
          return null;
        case ViewTypes.NAME:
          return (
            <Typography.Heading mt="3" width="full" textAlign="center">
              {data}
            </Typography.Heading>
          );

        case ViewTypes.DESC:
          return (
            <Box flex={1}>
              <Typography.Body2
                color="text-subdued"
                onLayout={(e) => {
                  setDescH(e.nativeEvent.layout.height);
                }}
              >
                {data}
              </Typography.Body2>
            </Box>
          );
        case ViewTypes.NFTCard:
          return (
            <NFTListAssetCard
              isAsset
              data={data}
              key={index}
              onSelect={() => handleSelectAsset(data)}
            />
          );
        default:
          return <Box flex={1} />;
      }
    },
    [handleSelectAsset],
  );

  return (
    <Modal
      size="2xl"
      footer={null}
      height="640px"
      staticChildrenProps={{ flex: 1 }}
    >
      <Box flex={1}>
        <RecyclerListView
          flex={1}
          style={{
            flex: 1,
            width: pageWidth,
            paddingLeft: padding,
            paddingRight: padding,
          }}
          dataProvider={dataProvider}
          layoutProvider={layoutProvider}
          rowRenderer={rowRenderer}
        />
      </Box>
    </Modal>
  );
};

export default CollectionModal;
