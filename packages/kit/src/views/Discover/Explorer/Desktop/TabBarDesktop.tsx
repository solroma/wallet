import { Image } from 'react-native';

import { Button, Stack, Text } from '@onekeyhq/components';
import dAppFavicon from '@onekeyhq/kit/assets/dapp_favicon.png';

import type { LayoutChangeEvent } from 'react-native';

export interface WebTab {
  id: string;
  url: string;
  // urlToGo?: string;
  title?: string;
  favicon?: string;
  thumbnail?: string;
  // isPinned: boolean;
  isCurrent: boolean;
  isBookmarked?: boolean;
  // isMuted: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;
  loading?: boolean;
  refReady?: boolean;
  timestamp?: number;
}
function Tab({
  isCurrent,
  id,
  title,
  favicon,
  onLayout,
}: WebTab & {
  onLayout?: (e: LayoutChangeEvent) => void;
}) {
  return id === 'home' ? (
    <Button
      buttonVariant="primary"
      borderRadius={0}
      bg={isCurrent ? '$bg' : '$bgHover'}
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
      onPress={() => console.log('setCurrentTab')}
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
          console.log('closeTab');
        }}
      >
        <Button.Icon name="XMarkMini" />
      </Button>
    </Stack>
  );
}

function TabBarDesktop() {
  const tabs: WebTab[] = Array.from({ length: 10 }).map((_, index) => ({
    isCurrent: false,
    id: index === 0 ? 'home' : index.toString(),
    url: 'https://google.com',
    title: 'Google',
    favicon: 'https://www.google.com/favicon.ico',
  }));
  return (
    <Stack flexDirection="row" w="100%" h="$8" alignItems="center">
      {tabs.map((tab, index) => (
        <Tab key={index} {...tab} />
      ))}
    </Stack>
  );
}

export default TabBarDesktop;
