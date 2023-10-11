import { ENFTDisplayType } from '../NFTList/type';

import { BTCAssetDetailContent } from './Components/BTCAsset/BTCAssetDetailContent';
import { BTCAssetImageContent } from './Components/BTCAsset/BTCAssetImageContent';
import { EVMAssetDetailContent } from './Components/EVMAsset/EVMAssetDetailContent';
import { EVMAssetImageContent } from './Components/EVMAsset/EVMAssetImageContent';

import type { IEVMNFTCollectionType, INFTListItem } from '../NFTList/type';

type Props = {
  asset: INFTListItem['content'];
  collection?: IEVMNFTCollectionType['content'];
  isOwner: boolean;
  networkId: string;
  accountId?: string;
  onRecycleUtxo?: () => void;
};

export type ComponentReturnProps = (params: Props) => JSX.Element | null;

type NFTDetailCompinents = {
  ImageContent: ComponentReturnProps;
  DetailContent: ComponentReturnProps;
};

function getNFTDetailComponents({
  asset,
}: {
  asset: INFTListItem;
}): NFTDetailCompinents {
  switch (asset.type) {
    case ENFTDisplayType.EVM_ITEM:
      return {
        ImageContent: EVMAssetImageContent as ComponentReturnProps,
        DetailContent: EVMAssetDetailContent as unknown as ComponentReturnProps,
      };
    // case NFTAssetType.SOL:
    //   return {
    //     ImageContent: SOLAssetImageContent as ComponentReturnProps,
    //     DetailContent: SOLAssetDetailContent as ComponentReturnProps,
    //   };
    case ENFTDisplayType.ORDINALS_ITEM:
      return {
        ImageContent: BTCAssetImageContent as ComponentReturnProps,
        DetailContent: BTCAssetDetailContent as ComponentReturnProps,
      };
    default:
      return {
        ImageContent: () => null,
        DetailContent: () => null,
      };
  }
}

export { getNFTDetailComponents };
