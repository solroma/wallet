import { useIsVerticalLayout } from '@onekeyhq/components';
import type { NFTAsset } from '@onekeyhq/engine/src/types/nft';

import CollectionModalView from '../../../views/Wallet/NFT/CollectionModal';
import NFTDetailView from '../../../views/Wallet/NFT/NFTDetail';
import { CollectiblesModalRoutes } from '../../routesEnum';

import { buildModalStackNavigatorOptions } from './buildModalStackNavigatorOptions';
import createStackNavigator from './createStackNavigator';

import type {
  IEVMNFTCollectionType,
  INFTListItem,
} from '../../../views/Wallet/NFT/NFTList/type';

export type CollectiblesRoutesParams = {
  [CollectiblesModalRoutes.CollectionModal]: {
    collectible: IEVMNFTCollectionType['content'];
    networkId: string;
    accountId: string;
  };
  [CollectiblesModalRoutes.NFTDetailModal]: {
    asset: INFTListItem | NFTAsset;
    collection?: IEVMNFTCollectionType['content'];
    isOwner: boolean;
    networkId: string;
    accountId?: string;
    onRecycleUtxo?: () => void;
  };
};

const CollectibleNavigator = createStackNavigator<CollectiblesRoutesParams>();

const modalRoutes = [
  {
    name: CollectiblesModalRoutes.CollectionModal,
    component: CollectionModalView,
  },
  {
    name: CollectiblesModalRoutes.NFTDetailModal,
    component: NFTDetailView,
  },
];

const CollectibleModalStack = () => {
  const isVerticalLayout = useIsVerticalLayout();
  return (
    <CollectibleNavigator.Navigator
      screenOptions={(navInfo) => ({
        headerShown: false,
        ...buildModalStackNavigatorOptions({ isVerticalLayout, navInfo }),
      })}
    >
      {modalRoutes.map((route) => (
        <CollectibleNavigator.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
    </CollectibleNavigator.Navigator>
  );
};

export default CollectibleModalStack;
