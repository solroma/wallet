import { memo, useCallback, useEffect, useRef } from 'react';

import { Button, Page } from '@onekeyhq/components';
import {
  HeaderButtonGroup,
  HeaderIconButton,
} from '@onekeyhq/components/src/layouts/Navigation/Header';
import backgroundApiProxy from '@onekeyhq/kit/src/background/instance/backgroundApiProxy';
import useAppNavigation from '@onekeyhq/kit/src/hooks/useAppNavigation';
import { ETabRoutes } from '@onekeyhq/kit/src/routes/Tab/type';

import { DesktopOverlay } from '../../components/WebView/DesktopOverlay';
import { useDAppNotifyChanges } from '../../hooks/useDAppNotifyChanges';
import { useActiveTabId, useWebTabs } from '../../hooks/useWebTabs';

import DesktopBrowserContent from './DesktopBrowserContent';
import DesktopBrowserNavigationContainer from './DesktopBrowserNavigationContainer';
import { withBrowserProvider } from './WithBrowserProvider';

function DesktopBrowserHeaderRight() {
  return (
    <HeaderButtonGroup>
      <HeaderIconButton icon="PlaceholderOutline" />
      <HeaderIconButton icon="PlaceholderOutline" />
      <HeaderIconButton
        icon="PlaceholderOutline"
        onPress={() => {
          void backgroundApiProxy.serviceDiscovery.notifyTest();
        }}
      />
    </HeaderButtonGroup>
  );
}

function DesktopBrowser() {
  const { tabs } = useWebTabs();
  const { activeTabId } = useActiveTabId();

  const navigation = useAppNavigation();
  const firstRender = useRef(true);
  useEffect(() => {
    if (!firstRender.current && tabs.length === 0) {
      navigation.switchTab(ETabRoutes.Discovery);
    }
    if (firstRender.current) {
      firstRender.current = false;
    }
  }, [tabs, navigation]);

  useDAppNotifyChanges({ tabId: activeTabId });

  const headerRightCall = useCallback(() => <DesktopBrowserHeaderRight />, []);

  return (
    <Page>
      <Page.Header
        // @ts-expect-error
        headerTitle={DesktopBrowserNavigationContainer}
        headerRight={headerRightCall}
      />
      <Page.Body>
        {tabs.map((t) => (
          <DesktopBrowserContent
            key={t.id}
            id={t.id}
            activeTabId={activeTabId}
          />
        ))}
        <DesktopOverlay />
      </Page.Body>
    </Page>
  );
}

export default memo(withBrowserProvider(DesktopBrowser));
