import type { ComponentProps, FC } from 'react';
import { useMemo } from 'react';

import { Box } from '@onekeyhq/components';
import type { NFTAsset } from '@onekeyhq/engine/src/types/nft';

import NFTImage from '../../../../../components/NFTImage';
import { MemoFallbackElement } from '../../../../../components/NFTPlaceholderElement';

type Props = {
  url?: string;
  asset?: NFTAsset;
  size: number;
  thumbnail?: boolean;
  skeleton?: boolean;
  resizeMode?: 'contain' | 'cover' | 'stretch' | 'center';
} & ComponentProps<typeof Box>;

const NFTListImage: FC<Props> = ({
  url,
  asset,
  resizeMode,
  size,
  skeleton = false,
  ...props
}) => {
  const imageUrl = useMemo(() => {
    if (url) {
      return url;
    }
    return asset?.imageUri;
  }, [url, asset]);

  if (imageUrl) {
    return (
      <Box size={`${size}px`} {...props} overflow="hidden">
        <NFTImage
          alt={undefined}
          resizeMode={resizeMode}
          width={`${size}px`}
          height={`${size}px`}
          url={imageUrl}
          skeleton={skeleton}
          bgColor="surface-neutral-default"
          fallbackElement={
            <MemoFallbackElement logoUrl={imageUrl} size={size} {...props} />
          }
        />
      </Box>
    );
  }
  return <MemoFallbackElement logoUrl={imageUrl} size={size} {...props} />;
};

export default NFTListImage;
