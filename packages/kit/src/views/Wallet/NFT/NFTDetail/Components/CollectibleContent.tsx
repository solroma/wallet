import type { FC } from 'react';

import {
  CustomSkeleton,
  useIsVerticalLayout,
  useUserDevice,
} from '@onekeyhq/components';
import {
  getContentWithAsset,
  getHttpImageWithAsset,
} from '@onekeyhq/engine/src/managers/nft';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

import NFTAudio from '../../../../../components/NFTAudio';
import { MemoFallbackElement } from '../../../../../components/NFTPlaceholderElement';
import NFTSVG from '../../../../../components/NFTSVG';
import NFTVideo from '../../../../../components/NFTVideo';
import NFTListImage from '../../NFTList/NFTListImage';
import useUniqueToken, { ComponentType } from '../useUniqueToken';

import type { IEVMNFTItemType } from '../../NFTList/type';

export type Props = {
  asset: IEVMNFTItemType['content'];
  size?: number;
};

const CollectibleContent: FC<Props> = ({ asset, size }) => {
  const { screenWidth } = useUserDevice();
  const isSmallScreen = useIsVerticalLayout();

  // eslint-disable-next-line no-nested-ternary
  const imageWidth = isSmallScreen
    ? platformEnv.isExtension
      ? 176
      : screenWidth - 32
    : 288;

  const uri = getContentWithAsset({
    contentUri: asset.metadata?.animation_url || asset.metadata?.image,
  });

  const { componentType } = useUniqueToken(uri);

  if (uri) {
    if (componentType === undefined) {
      return (
        <CustomSkeleton size={size || `${imageWidth}px`} borderRadius="12px" />
      );
    }
    if (componentType === ComponentType.Image) {
      return (
        <NFTListImage
          url={uri}
          size={size || imageWidth}
          borderRadius="12px"
          shadow="depth.5"
        />
      );
    }
    if (componentType === ComponentType.Video) {
      return <NFTVideo url={uri} size={size || imageWidth} />;
    }
    if (componentType === ComponentType.SVG) {
      return <NFTSVG url={uri} size={size || imageWidth} />;
    }
    if (componentType === ComponentType.Audio) {
      const imageUrl = getHttpImageWithAsset(asset);
      return <NFTAudio url={uri} size={size || imageWidth} poster={imageUrl} />;
    }
  }
  return <MemoFallbackElement logoUrl={uri} size={size || imageWidth} />;
};

export default CollectibleContent;
