import { memo, useMemo } from 'react';

import {
  Badge,
  Box,
  HStack,
  Pressable,
  Text,
  useIsVerticalLayout,
  useTheme,
  useUserDevice,
} from '@onekeyhq/components';
import type { NFTAsset } from '@onekeyhq/engine/src/types/nft';
import { MAX_PAGE_CONTAINER_WIDTH } from '@onekeyhq/shared/src/config/appConfig';

import { convertToMoneyFormat } from '../utils';

import NFTListImage from './NFTListImage';
import { ENFTCollectionType } from './type';

import type {
  IEVMNFTItemType,
  ListDataType,
  ListItemComponentType,
  ListItemType,
} from './type';

export function keyExtractor(
  item: ListItemType<ListDataType>,
  index: number,
): string {
  const data = item.data as NFTAsset;
  if (data.contractAddress && data.tokenId) {
    return data.contractAddress + data.tokenId;
  }
  if (data.tokenAddress) {
    return data.tokenAddress;
  }
  return `NFTAsset ${index}`;
}

function NFTListAssetCard({
  onSelect,
  data: asset,
  ...rest
}: ListItemComponentType<IEVMNFTItemType['content']>) {
  const isSmallScreen = useIsVerticalLayout();
  const { screenWidth } = useUserDevice();

  const MARGIN = isSmallScreen ? 16 : 20;
  const padding = isSmallScreen ? 8 : 12;

  const pageWidth = isSmallScreen
    ? screenWidth
    : Math.min(MAX_PAGE_CONTAINER_WIDTH, screenWidth - 224);
  const cardWidth = isSmallScreen
    ? Math.floor((pageWidth - MARGIN * 3) / 2)
    : 177;
  const { themeVariant } = useTheme();

  const AmountTag = useMemo(() => {
    if (
      asset?.amount &&
      Number(asset?.amount) > 1 &&
      asset.collectionType === ENFTCollectionType.ERC1155
    ) {
      return (
        <Badge
          position="absolute"
          right="8px"
          bottom="8px"
          title={`X ${convertToMoneyFormat(asset.amount)}`}
          size="sm"
          type="default"
        />
      );
    }
    return null;
  }, [asset?.amount, asset.collectionType]);
  return (
    <Box mb="16px" {...rest}>
      <Pressable
        flexDirection="column"
        bgColor="surface-default"
        padding={`${padding}px`}
        overflow="hidden"
        borderRadius="12px"
        borderColor="border-subdued"
        borderWidth={themeVariant === 'light' ? 1 : undefined}
        width={cardWidth}
        _hover={{ bg: 'surface-hovered' }}
        onPress={onSelect}
      >
        <Box position="relative">
          <NFTListImage
            url={asset.metadata?.image}
            borderRadius="6px"
            size={cardWidth - 2 * padding}
          />
          {AmountTag}
        </Box>
        <HStack mt={`${padding}px`} w="100%" justifyContent="space-between">
          <Text flex={1} typography="Body2" height="20px" numberOfLines={1}>
            {asset.metadata?.item_name ?? `# ${asset.itemId}`}
          </Text>
        </HStack>
        <Box height="20px" />
      </Pressable>
    </Box>
  );
}

export default memo(NFTListAssetCard);
