import { memo } from 'react';

import {
  Box,
  HStack,
  Text,
  useIsVerticalLayout,
  useTheme,
  useUserDevice,
} from '@onekeyhq/components';
import Pressable from '@onekeyhq/components/src/Pressable/Pressable';
import type { Collection } from '@onekeyhq/engine/src/types/nft';

import { NFTNetworkIcon } from './NetworkIcon';
import NFTListImage from './NFTListImage';

import type {
  IEVMNFTCollectionType,
  ListDataType,
  ListItemComponentType,
  ListItemType,
} from './type';

function CollectionCard({
  onSelect,
  data: collectible,
  ...rest
}: ListItemComponentType<IEVMNFTCollectionType['content']>) {
  const isSmallScreen = useIsVerticalLayout();
  const { screenWidth } = useUserDevice();

  const MARGIN = isSmallScreen ? 16 : 20;
  const padding = isSmallScreen ? 8 : 12;
  const width = isSmallScreen
    ? Math.floor((screenWidth - MARGIN * 3) / 2)
    : 177;
  const { themeVariant } = useTheme();
  const contentSize = width - 2 * padding;
  return (
    <Box mb="16px" {...rest}>
      <Pressable
        bgColor="surface-default"
        padding={`${padding}px`}
        overflow="hidden"
        borderRadius="12px"
        borderColor="border-subdued"
        borderWidth={themeVariant === 'light' ? 1 : undefined}
        width={width}
        flexDirection="column"
        _hover={{ bg: 'surface-hovered' }}
        onPress={onSelect}
      >
        <Box position="relative">
          <NFTListImage
            url={collectible.logoURI}
            borderRadius="6px"
            size={contentSize}
          />
          <NFTNetworkIcon networkId={collectible.networkId} />
        </Box>
        <HStack mt={`${padding}px`} justifyContent="space-between">
          <Text typography="Body2" height="20px" numberOfLines={1} flex={1}>
            {collectible.name ?? ''}
          </Text>
        </HStack>
        <Text typography="Body2" height="20px" color="text-subdued">
          {`${collectible.amount} Items`}
        </Text>
      </Pressable>
    </Box>
  );
}

export function keyExtractor(
  item: ListItemType<ListDataType>,
  index: number,
): string {
  const data = item.data as Collection;
  if (data.contractAddress) {
    return `Collection ${data.contractAddress}`;
  }
  if (data.contractName) {
    return `Collection ${data.contractName}`;
  }
  return `Collection ${index}`;
}

export default memo(CollectionCard);
