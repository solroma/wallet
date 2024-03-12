import { useCallback } from 'react';

import type { IPageNavigationProp } from '@onekeyhq/components';
import { XStack } from '@onekeyhq/components';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';

import { EModalSwapRoutes } from '../../router/types';
import { withSwapProvider } from '../WithSwapProvider';

import SwapHistoryButtonContainer from './SwapHistoryButtonContainer';

import type { IModalSwapParamList } from '../../router/types';
import { EModalRoutes } from '@onekeyhq/shared/src/routes';

const SwapHeaderRightActionContainer = () => {
  const navigation =
    useAppNavigation<IPageNavigationProp<IModalSwapParamList>>();

  // const onOpenSlippageModal = useCallback(() => {}, [navigation]);

  const onOpenHistoryListModal = useCallback(() => {
    navigation.pushModal(EModalRoutes.SwapModal, {
      screen: EModalSwapRoutes.SwapHistoryList,
    });
  }, [navigation]);
  return (
    <XStack justifyContent="flex-end">
      <SwapHistoryButtonContainer
        onHistoryButtonPress={onOpenHistoryListModal}
      />
      {/* <SwapSlippageTrigger onOpenSlippageModal={onOpenSlippageModal} /> */}
    </XStack>
  );
};

export default withSwapProvider(SwapHeaderRightActionContainer);
