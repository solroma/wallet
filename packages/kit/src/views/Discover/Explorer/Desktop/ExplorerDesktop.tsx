import { useEffect } from 'react';

import { Stack, useThemeValue } from '@onekeyhq/components';
import useSafeAreaInsets from '@onekeyhq/components/src/Provider/hooks/useSafeAreaInsets';
import simpleDb from '@onekeyhq/engine/src/dbs/simple/simpleDb';

import { usePromiseResult } from '../../../../hooks/usePromiseResult';
import {
  atomWebTabs,
  atomWebTabsMap,
  homeTab,
  tabsToMap,
  useAtomWebTabs,
  withProviderWebTabs,
} from '../Context/contextWebTabs';
import { webHandler } from '../explorerUtils';

import ControllerBarDesktop from './ControllerBarDesktop';
import TabBarDesktop from './TabBarDesktop';

const showExplorerBar = webHandler !== 'browser';

export function useTabBarDataFromSimpleDb() {
  const result = usePromiseResult(async () => {
    const r = await simpleDb.discoverWebTabs.getRawData();
    return r?.tabs || [{ ...homeTab }];
  }, []);

  return result;
}

function HandleRebuildTabBarData() {
  const result = useTabBarDataFromSimpleDb();
  const [, setWebTabs] = useAtomWebTabs(atomWebTabs);
  const [, setWebTabsMap] = useAtomWebTabs(atomWebTabsMap);
  useEffect(() => {
    const data = result.result;
    console.log('===>result: ', data);
    if (data && Array.isArray(data)) {
      setWebTabs(data);
      setWebTabsMap(tabsToMap(data));
    }
  }, [result.result, setWebTabs, setWebTabsMap]);

  return null;
}

function ExplorerHeaderCmp() {
  const { top } = useSafeAreaInsets();
  const tabBarBgColor = useThemeValue('bgSubdued') as string;
  return (
    <Stack mt={`${top ? top + 10 : 0}px`} bg={tabBarBgColor} zIndex={5}>
      <HandleRebuildTabBarData />
      <TabBarDesktop />
      <ControllerBarDesktop />
    </Stack>
  );
}

const ExplorerHeader = withProviderWebTabs(ExplorerHeaderCmp);

function ExplorerDesktop() {
  return (
    <Stack flex={1} zIndex={3}>
      {!showExplorerBar && <ExplorerHeader />}
      <Stack>WebView Content</Stack>
    </Stack>
  );
}

export default ExplorerDesktop;
