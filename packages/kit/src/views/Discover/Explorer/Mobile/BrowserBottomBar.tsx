import { useEffect } from 'react';

import { take } from 'lodash';
import { Dimensions, StyleSheet } from 'react-native';
import { captureScreen } from 'react-native-view-shot';

import { Button, IconButton, Stack } from '@onekeyhq/components';
import type { PageNavigationProp } from '@onekeyhq/components/src/Navigation';
import useSafeAreaInsets from '@onekeyhq/components/src/Provider/hooks/useSafeAreaInsets';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import { ModalRoutes } from '@onekeyhq/kit/src/routes/Root/Modal/Routes';

import { useWebController } from '../../Controller/useWebController';
import { useWebTabs } from '../../Controller/useWebTabs';
import { type DiscoverModalParamList, DiscoverModalRoutes } from '../../types';
import { homeTab, webTabsActions } from '../Context/contextWebTabs';

function BrowserBottomBar({ showHome }: { showHome?: () => void }) {
  const navigation =
    useAppNavigation<PageNavigationProp<DiscoverModalParamList>>();
  const { currentTab, goBack, goForward } = useWebController();
  const { bottom } = useSafeAreaInsets();
  const { canGoForward, url } = currentTab ?? {};
  const { tabs } = useWebTabs();

  useEffect(() => {
    if (url === homeTab.url) {
      showHome?.();
    }
  }, [url, showHome]);
  const takeSnapshoot = (tabId: string) =>
    new Promise((resolve, reject) => {
      const THUMB_WIDTH = Dimensions.get('window').width / 2 - 16 * 2;
      captureScreen({
        format: 'jpg',
        quality: 0.2,
        width: THUMB_WIDTH,
        height: THUMB_WIDTH * 1.81,
      })
        .then(
          (uri) => {
            webTabsActions.setWebTabData({
              id: tabId,
              thumbnail: uri,
            });
            resolve(true);
            console.log('Image saved to', uri);
          },
          (error) => {
            console.error('Oops, snapshot failed', error);
            reject(error);
          },
        )
        .catch((e) => {
          console.log('e===>: ', e);
        });
    });

  return (
    <Stack bg="$bgActiveDark" height="$14" zIndex={1} display="flex">
      <Stack
        flex={1}
        flexDirection="row"
        overflow="hidden"
        mb={`${bottom}px`}
        alignItems="center"
        justifyContent="space-between"
      >
        <IconButton
          icon="ArrowLeftOutline"
          disabled={currentTab?.url === homeTab.url}
          onPress={goBack}
        />
        <IconButton
          icon="ArrowTopOutline"
          disabled={!canGoForward}
          onPress={goForward}
        />
        <IconButton
          icon="PlusLargeOutline"
          onPress={() => webTabsActions.addBlankWebTab()}
        />
        <Button
          onPress={async () => {
            await takeSnapshoot(currentTab.id);
            navigation.pushModal(ModalRoutes.DiscoverModal, {
              screen: DiscoverModalRoutes.MobileTabList,
            });
          }}
        >
          {tabs.length}
        </Button>
        <IconButton
          icon="PlusLargeOutline"
          onPress={() => console.log('show more menu')}
        />
      </Stack>
    </Stack>
  );
}

export default BrowserBottomBar;
