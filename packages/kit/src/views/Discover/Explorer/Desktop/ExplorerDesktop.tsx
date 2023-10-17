import { Stack, useThemeValue } from '@onekeyhq/components';
import useSafeAreaInsets from '@onekeyhq/components/src/Provider/hooks/useSafeAreaInsets';

import { webHandler } from '../explorerUtils';

import TabBarDesktop from './TabBarDesktop';

const showExplorerBar = webHandler !== 'browser';

function ExplorerDesktop() {
  const { top } = useSafeAreaInsets();
  const tabBarBgColor = useThemeValue('bgSubdued') as string;
  console.log(tabBarBgColor);
  return (
    <Stack flex={1} zIndex={3}>
      {!showExplorerBar && (
        <Stack mt={`${top ? top + 10 : 0}px`} bg={tabBarBgColor} zIndex={5}>
          <TabBarDesktop />
        </Stack>
      )}
      <Stack>WebView Content</Stack>
    </Stack>
  );
}

export default ExplorerDesktop;
