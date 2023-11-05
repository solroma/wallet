import { useEffect, useState } from 'react';

import { Freeze } from 'react-freeze';

import {
  Button,
  Screen,
  Stack,
  Text,
  Toast,
  XStack,
  YStack,
} from '@onekeyhq/components';
import WebContent from '@onekeyhq/kit/src/views/Discover/Explorer/Content/WebContent';

import {
  atomWebTabs,
  atomWebTabsMap,
  useAtomWebTabs,
  withProviderWebTabs,
} from '../../../../views/Discover/Explorer/Context/contextWebTabs';

import type { WebTab } from '../../../../views/Discover/Explorer/Context/contextWebTabs';

function TabWebViewContent({ webTab }: { webTab: WebTab }) {
  const [map] = useAtomWebTabs(atomWebTabsMap);
  const t = map[webTab.id];
  return (
    <Freeze key={t.id} freeze={!t.isCurrent}>
      <WebContent {...t} />
    </Freeze>
  );
}

function TabWebViewContainer() {
  const [tabData] = useAtomWebTabs(atomWebTabs);
  useEffect(() => {
    console.log('====>render. tabs: ', tabData.tabs);
  }, [tabData.tabs]);
  return (
    <Stack flex={1}>
      {tabData.tabs.map((t) => (
        <TabWebViewContent webTab={t} />
      ))}
    </Stack>
  );
}

export default withProviderWebTabs(TabWebViewContainer);
