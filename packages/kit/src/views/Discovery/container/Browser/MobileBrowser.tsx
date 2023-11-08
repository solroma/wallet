import { memo, useEffect, useMemo } from 'react';

import { Stack } from 'tamagui';

import type { PageNavigationProp } from '@onekeyhq/components/src/Navigation';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import { ModalRoutes } from '@onekeyhq/kit/src/routes/Root/Modal/Routes';

import MobileBrowserContent from '../../components/MobileBrowser/MobileBrowserContent';
import MobileBrowserInfoBar from '../../components/MobileBrowser/MobileBrowserInfoBar';
import { useTabDataFromSimpleDb } from '../../hooks/useTabDataFromSimpleDb';
import useWebTabAction from '../../hooks/useWebTabAction';
import {
  useActiveTabId,
  useWebTabData,
  useWebTabs,
} from '../../hooks/useWebTabs';
import {
  type DiscoverModalParamList,
  DiscoverModalRoutes,
} from '../../router/Routes';
import { gotoSite } from '../../utils/gotoSite';
import { withProviderWebTabs } from '../Context/contextWebTabs';

function HandleRebuildTabBarData() {
  const result = useTabDataFromSimpleDb();
  const { setWebTabs, addBlankWebTab } = useWebTabAction();

  useEffect(() => {
    if (!result.result) return;
    const data = result.result;
    if (data && Array.isArray(data) && data.length > 0) {
      setWebTabs(data);
    } else {
      addBlankWebTab();
    }
  }, [result.result, addBlankWebTab, setWebTabs]);

  return null;
}

function MobileBrowser() {
  const { tabs } = useWebTabs();
  const { activeTabId } = useActiveTabId();
  const { tab } = useWebTabData(activeTabId ?? '');
  const navigation =
    useAppNavigation<PageNavigationProp<DiscoverModalParamList>>();

  useEffect(() => {
    console.log('MobileBrowser renderer ===> : ');
  }, []);

  const content = useMemo(
    () => tabs.map((t) => <MobileBrowserContent id={t.id} key={t.id} />),
    [tabs],
  );

  return (
    <Stack flex={1} zIndex={3}>
      <HandleRebuildTabBarData />
      <MobileBrowserInfoBar
        id={activeTabId ?? ''}
        title={tab?.title ?? ''}
        favicon={tab?.favicon ?? ''}
        onSearch={() => {
          navigation.pushModal(ModalRoutes.DiscoverModal, {
            screen: DiscoverModalRoutes.SearchModal,
            params: {
              onSubmitContent: (text: string) => {
                console.log('onSubmitContent: ===> : ', text);
                gotoSite({
                  url: text,
                  isNewWindow: false,
                  userTriggered: true,
                });
              },
            },
          });
        }}
      />
      {content}
    </Stack>
  );
}

export default memo(withProviderWebTabs(MobileBrowser));
