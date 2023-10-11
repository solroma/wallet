import type { ComponentProps } from 'react';

import type { Box } from '@onekeyhq/components';
import type {
  Collection,
  NFTAsset,
  NFTAssetType,
  NFTBTCAssetModel,
} from '@onekeyhq/engine/src/types/nft';

export type ListDataType = Collection | NFTAsset | NFTBTCAssetModel;

export enum NFTCardType {
  EVMAsset = 'EVMAsset',
  EVMCollection = 'EVMCollection',
  SOLAsset = 'SOLAsset',
  SOLCollection = 'SOLCollection',
  BTCAsset = 'BTCAsset',
}

export type ListItemType<T> = {
  data: T;
  isAsset: boolean;
  type?: NFTAssetType;
  key?: string;
};

export type ListItemComponentType<T> = ComponentProps<typeof Box> &
  ListItemType<T> & {
    onSelect: () => void;
  };

export type InscriptionContentProps = {
  asset: IOrdinalsItemType['content'];
} & ComponentProps<typeof Box>;

export enum ENFTCollectionType {
  ERC721 = 1,
  ERC1155 = 2,
  ORDINALS = 3,
}

export enum ENFTDisplayType {
  EVM_COLLECTION = 1,
  EVM_ITEM = 2,
  ORDINALS_ITEM = 3,
}

export type IEVMNFTCollectionType = {
  type: ENFTDisplayType.EVM_COLLECTION;
  content: {
    networkId: string;
    accountAddress: string;

    name: string;
    description: string;
    value: string;
    symbol: string;
    logoURI: string;
    collectionId: string;
    amount: string;
    collectionType: ENFTCollectionType;
  };
};

export type IEVMNFTItemType = {
  type: ENFTDisplayType.EVM_ITEM;
  content: {
    networkId: string;
    accountAddress: string;
    xpub?: string;
    collectionId: string;
    collectionType: ENFTCollectionType;

    amount: string;
    holderAddress: string;
    itemId: string;
    metadata?: {
      item_name?: string;
      description: string;
      item_url?: string;
      image?: string;
      animation_url?: string;
      external_url?: string;
      attributes?: {
        trait_type: string;
        value: string;
      }[];
    };
    last_metadata_sync?: number;
    last_token_uri_sync?: number;
    mintBlock?: number;
    blockHeight?: number;
    name?: string;
    symbol?: string;
  };
};

export type IOrdinalsItemType = {
  type: ENFTDisplayType.ORDINALS_ITEM;
  content: {
    networkId: string;
    accountAddress: string;

    tx_hash: string;
    output_value_sat: number;
    inscription_id: string;
    inscription_number: number;
    timestamp: string;
    own_timestamp: string;
    owner: string;
    output: string;
    location: string;
    genesis_transaction_hash: string;
    content_length: number;
    content_type: string;
    content: string | null;
    contentUrl: string;
    type: string;
  };
};

export type IPaginationRequest<T> = {
  page: number;
  pageSize: number;
} & T;

export type IPaginationResponse<T> = {
  pagination: {
    current: number;
    pageSize: number;
    hasNext: boolean;
  };
} & T;

export type INFTListItem =
  | IEVMNFTCollectionType
  | IEVMNFTItemType
  | IOrdinalsItemType;

export type IOverviewAccountNFTCollectionsResponse = IPaginationResponse<{
  data: INFTListItem[];
}>;
