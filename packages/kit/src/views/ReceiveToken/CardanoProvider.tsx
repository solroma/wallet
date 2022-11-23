import { forwardRef, useCallback, useRef } from 'react';

import { IWebViewWrapperRef } from '@onekeyfe/onekey-cross-webview';

import { Box, Button } from '@onekeyhq/components';
import { WebViewWebEmbed } from '@onekeyhq/kit/src/components/WebView/WebViewWebEmbed';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

export function CardanoWebView() {
  const webviewRef = useRef<IWebViewWrapperRef | null>(null);

  const onWebViewRef = useCallback((ref: IWebViewWrapperRef | null) => {
    console.log('get webview ref');
    webviewRef.current = ref;
  }, []);

  const onBridge = async () => {
    console.log('onBridge');
    const res = await webviewRef.current?.jsBridge?.request({
      data: {
        method: 'FAKE METHOD',
      },
      scope: '$private',
    });
    console.log('bridge ====> ', res);
  };

  const routePath = '/cardano';

  return (
    <Box minH="320px" minW="320px" flex="1">
      <Button
        onPress={() => {
          onBridge();
        }}
      >
        Bridge
      </Button>
      <WebViewWebEmbed
        isSpinnerLoading
        onWebViewRef={onWebViewRef}
        onContentLoaded={() => {
          console.log('Loaded');
        }}
        // customReceiveHandler={receiveHandler}
        // *** use web-embed local html file
        routePath={routePath}
        // *** use remote url
        src={
          platformEnv.isDev
            ? `http://192.168.50.36:3008/#${routePath}`
            : undefined
        }
      />
    </Box>
  );
}

// const CardanoWebViewRef = forwardRef<any, any>((props, ref) => (
//   <CardanoWebView />
// ));

// CardanoWebViewRef.displayName = 'CardanoWebViewRef';

// export default CardanoWebViewRef;
