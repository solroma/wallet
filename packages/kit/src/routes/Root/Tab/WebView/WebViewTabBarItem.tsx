import { useMemo } from 'react';

import {
  IconButton,
  Screen,
  Stack,
  Text,
  XStack,
  YStack,
} from '@onekeyhq/components';

import {
  atomWebTabs,
  useAtomWebTabs,
  withProviderWebTabs,
} from '../../../../views/Discover/Explorer/Context/contextWebTabs';

function WebViewTabBarItem({ isActive }: { isActive: boolean }) {
  const [tabData] = useAtomWebTabs(atomWebTabs);
  return (
    <Stack flex={1}>
      {tabData.tabs.map((t) => (
        <YStack
          key={t.id}
          borderWidth="$-0.5"
          borderColor="$border"
          mt="$3"
          onPress={() => {
            console.log('hello 1');
          }}
        >
          <XStack justifyContent="space-between">
            {isActive && t.isCurrent && (
              <Stack w="$2" h="100%" bg="red" mr="$2" />
            )}
            <Text>{t.title}</Text>
            <IconButton
              icon="CrossedSmallSolid"
              size="small"
              onPress={(e) => {
                console.log(e);
                e.stopPropagation();
                console.log('hello 2');
              }}
            />
          </XStack>
        </YStack>
      ))}
    </Stack>
  );
}

export default withProviderWebTabs(WebViewTabBarItem);
