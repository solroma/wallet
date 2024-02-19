import { useCallback, useMemo, useState } from 'react';

import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';

import { Button, SizableText, YStack } from '@onekeyhq/components';
import type { IPageNavigationProp } from '@onekeyhq/components/src/layouts/Navigation';
import {
  WALLET_CONNECT_CLIENT_META,
  WALLET_CONNECT_V2_PROJECT_ID,
} from '@onekeyhq/shared/src/walletConnect/constant';
import { EAccountSelectorSceneName } from '@onekeyhq/shared/types';

import backgroundApiProxy from '../../../background/instance/backgroundApiProxy';
import {
  AccountSelectorActiveAccountLegacy,
  AccountSelectorProviderMirror,
  AccountSelectorTriggerLegacy,
} from '../../../components/AccountSelector';
import useAppNavigation from '../../../hooks/useAppNavigation';
import { EModalRoutes } from '../../../routes/Modal/type';
import { EOnboardingPages } from '../../Onboarding/router/type';
import { ETestModalPages } from '../../TestModal/router/type';
import { ETabDeveloperRoutes } from '../type';

import type { ITabDeveloperParamList } from '../type';

function HomeAccountSelectorInfoDemo() {
  return (
    <YStack mx="$2" my="$4">
      <AccountSelectorTriggerLegacy num={0} />
      <AccountSelectorActiveAccountLegacy num={0} />
      <Button
        onPress={() => {
          // void backgroundApiProxy.serviceHardware.showEnterPinOnDeviceDialog();
        }}
      >
        硬件输入 PIN
      </Button>
      <Button
        onPress={() => {
          void backgroundApiProxy.serviceHardware.showEnterPassphraseOnDeviceDialog();
        }}
      >
        硬件输入 Passphrase
      </Button>
      <Button
        onPress={async () => {
          const core = new Core({
            projectId: WALLET_CONNECT_V2_PROJECT_ID,
          });
          await Web3Wallet.init({
            core,
            metadata: WALLET_CONNECT_CLIENT_META,
          });
        }}
      >
        @walletconnect/core
      </Button>
    </YStack>
  );
}

export default function HomePageHeaderView() {
  const navigation =
    useAppNavigation<IPageNavigationProp<ITabDeveloperParamList>>();
  const [headerHighMode, setHeaderHighMode] = useState(true);

  const headerHeightCall = useCallback(() => {
    setHeaderHighMode((pre) => !pre);
  }, []);

  const onNextPageCall = useCallback(() => {
    navigation.push(ETabDeveloperRoutes.DevHomeStack1, {
      a: '1',
      b: '2',
    });
  }, [navigation]);

  const navigateTestSimpleModal = useCallback(() => {
    navigation.pushModal(EModalRoutes.TestModal, {
      screen: ETestModalPages.TestSimpleModal,
    });
  }, [navigation]);

  const navigateFullScreenSimpleModal = useCallback(() => {
    navigation.pushFullModal(EModalRoutes.OnboardingModal, {
      screen: EOnboardingPages.GetStarted,
    });
  }, [navigation]);

  const navigateOnboardingModal = useCallback(() => {
    navigation.pushModal(EModalRoutes.OnboardingModal, {
      screen: EOnboardingPages.GetStarted,
    });
  }, [navigation]);

  return useMemo(
    () => (
      <YStack alignItems="center" justifyContent="center" py="$4" space="$3">
        <AccountSelectorProviderMirror
          config={{
            sceneName: EAccountSelectorSceneName.home,
            sceneUrl: '',
          }}
          enabledNum={[0]}
        >
          <HomeAccountSelectorInfoDemo />
        </AccountSelectorProviderMirror>
        <SizableText>Header View Simple</SizableText>
        <SizableText>{`Header Height ${headerHighMode.toString()}`}</SizableText>
        {headerHighMode && <SizableText py="$10">Very high</SizableText>}
        <Button onPress={headerHeightCall}>切换高度</Button>
        {/* <Button onPress={switchDemoVisibleCall}>切换 Demo3 显示</Button> */}
        <Button onPress={onNextPageCall}>下一页</Button>
        <Button onPress={navigateTestSimpleModal}>to TestSimpleModal</Button>
        <Button onPress={navigateOnboardingModal}>Onboarding</Button>
        <Button onPress={navigateFullScreenSimpleModal}>
          to fullScreen Onboarding
        </Button>
      </YStack>
    ),
    [
      headerHighMode,
      headerHeightCall,
      onNextPageCall,
      navigateTestSimpleModal,
      navigateFullScreenSimpleModal,
      navigateOnboardingModal,
    ],
  );
}
