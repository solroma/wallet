import type { ComponentProps, FC } from 'react';

import NetImage from '@onekeyhq/components/src/NetImage';

type Props = {
  url?: string | null;
  s3Url?: string;
  nftSource?: {
    contractAddress?: string;
    tokenId: string;
    url?: string;
  };
} & ComponentProps<typeof NetImage>;

const NFTImage: FC<Props> = ({ nftSource, ...rest }) => {
  const url = rest.url ?? rest.s3Url;

  return <NetImage {...rest} src={url} />;
};
export default NFTImage;
