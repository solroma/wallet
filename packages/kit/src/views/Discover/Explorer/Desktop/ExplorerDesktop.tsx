import { Stack, useThemeValue } from '@onekeyhq/components';
import useSafeAreaInsets from '@onekeyhq/components/src/Provider/hooks/useSafeAreaInsets';

import { withProviderWebTabs } from '../Context/contextWebTabs';
import { webHandler } from '../explorerUtils';

import ControllerBarDesktop from './ControllerBarDesktop';
import TabBarDesktop from './TabBarDesktop';

const showExplorerBar = webHandler !== 'browser';

function ExplorerHeaderCmp() {
  const { top } = useSafeAreaInsets();
  const tabBarBgColor = useThemeValue('bgSubdued') as string;
  return (
    <Stack mt={`${top ? top + 10 : 0}px`} bg={tabBarBgColor} zIndex={5}>
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
