import { useMemo } from 'react';

import { Box } from '@onekeyhq/components';

import CollectionCard from './CollectionCard';
import NFTBTCAssetCard from './NFTBTCAssetCard';
import { ENFTDisplayType } from './type';

import type { INFTListItem } from './type';

export const NFTListItemComp = ({
  type,
  onSelect,
  content,
}: INFTListItem & { onSelect: () => void }) => {
  const dom = useMemo(() => {
    if (type === ENFTDisplayType.EVM_COLLECTION) {
      return (
        <CollectionCard isAsset={false} data={content} onSelect={onSelect} />
      );
    }
    if (type === ENFTDisplayType.ORDINALS_ITEM) {
      return <NFTBTCAssetCard isAsset data={content} onSelect={onSelect} />;
    }
    return null;
  }, [type, content, onSelect]);

  return (
    <Box mb="4" mr="4">
      {dom}
    </Box>
  );
};
