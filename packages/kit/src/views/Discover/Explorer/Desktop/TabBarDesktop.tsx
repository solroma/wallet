import { useCallback } from 'react';

import { Image } from 'react-native';

import { Button, Stack, Text } from '@onekeyhq/components';
import { DebugRenderTracker } from '@onekeyhq/components/src/DebugRenderTracker';
import dAppFavicon from '@onekeyhq/kit/assets/dapp_favicon.png';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

import {
  addBlankWebTabAtomWithWriteOnly,
  atomWebTabs,
  atomWebTabsMap,
  closeWebTabAtomWithWriteOnly,
  setCurrentWebTabAtomWithWriteOnly,
  useAtomWebTabs,
} from '../Context/contextWebTabs';
import { dismissWebviewKeyboard } from '../explorerUtils';

import type { LayoutChangeEvent } from 'react-native';

function Tab({
  tabId,
  onLayout,
}: {
  tabId: string;
  onLayout?: (e: LayoutChangeEvent) => void;
}) {
  const [map] = useAtomWebTabs(atomWebTabsMap);
  const tab = map[tabId] ?? {};
  const { isCurrent, title, favicon } = tab;
  const [, setCurrentWebTabAction] = useAtomWebTabs(
    setCurrentWebTabAtomWithWriteOnly,
  );
  const [, closeWebTab] = useAtomWebTabs(closeWebTabAtomWithWriteOnly);
  const setCurrentTab = useCallback(() => {
    if (platformEnv.isNative) {
      dismissWebviewKeyboard();
    }
    setCurrentWebTabAction(tabId);
  }, [tabId, setCurrentWebTabAction]);
  const closeTab = useCallback(() => {
    closeWebTab(tabId);
  }, [tabId, closeWebTab]);

  return (
    <DebugRenderTracker>
      {tabId === 'home' ? (
        <Button
          buttonVariant="primary"
          borderRadius={0}
          bg={isCurrent ? '$bg' : '$bgHover'}
          onPress={setCurrentTab}
        >
          <Button.Icon name="HomeMini" style={{ width: 16, height: 16 }} />
        </Button>
      ) : (
        <Stack
          height="32px"
          hoverStyle={{
            bg: isCurrent ? '$bg' : '$bgPrimaryHover',
          }}
          borderRightColor="$border"
          borderRightWidth="0.5px"
          px="$3"
          bg={isCurrent ? '$bg' : '$bgHover'}
          onPress={setCurrentTab}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          onLayout={onLayout}
        >
          <Image
            style={{ width: 16, height: 16, marginRight: 8 }}
            source={{ uri: favicon }}
            defaultSource={dAppFavicon}
          />
          <Text
            maxWidth="82px"
            marginRight="10px"
            color={isCurrent ? '$text' : '$textSubdued'}
            variant="$bodySmMedium"
          >
            {title}
          </Text>
          <Button
            size="small"
            onPress={(e) => {
              e.stopPropagation();
              closeTab();
            }}
          >
            <Button.Icon name="XMarkMini" />
          </Button>
        </Stack>
      )}
    </DebugRenderTracker>
  );
}

const AddTabButton = () => {
  const [, addBlankWebTab] = useAtomWebTabs(addBlankWebTabAtomWithWriteOnly);
  // const [readOnlyTabs] = useAtomWebTabs(atomWebTabsReadWrite);
  // console.log('tabs ===>: ', readOnlyTabs);
  return (
    <Button
      borderRadius={0}
      onPress={() => {
        addBlankWebTab();
      }}
    >
      <Button.Icon name="PlusMini" />
    </Button>
  );
};

function TabBarDesktop() {
  const [tabs] = useAtomWebTabs(atomWebTabs);
  console.log('tabs ===>: ', tabs);
  return (
    <Stack flexDirection="row" w="100%" h="$8" alignItems="center">
      {tabs.map((tab) => (
        <Tab key={tab.id} tabId={tab.id} />
      ))}
      <AddTabButton />
    </Stack>
  );
}

export default TabBarDesktop;
