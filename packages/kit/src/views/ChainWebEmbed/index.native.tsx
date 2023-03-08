import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { OnekeyNetwork } from '@onekeyhq/shared/src/config/networkIds';
import {
  AppUIEventBusNames,
  appUIEventBus,
} from '@onekeyhq/shared/src/eventBus/appUIEventBus';
import debugLogger from '@onekeyhq/shared/src/logger/debugLogger';

import { CardanoWebEmbedView } from './CardanoWebEmbedView';

function ChainWebEmbed() {
  const cardanoRef = useRef(null);
  const [isWebViewActive, setIsWebViewActive] = useState(false);
  const [usedNetworks, setUsedNetworks] = useState<string[]>([]);
  const callbackRef = useRef<() => void>();

  const webviewCallback = useCallback(() => {
    debugLogger.common.debug('execute webviewCallback, 2');
    callbackRef.current?.();
  }, []);

  useEffect(() => {
    const onCheckWebView = (resolve: () => void, networkId: string) => {
      if (!cardanoRef.current) {
        debugLogger.common.debug('not create webview, 1');
        if (resolve) {
          debugLogger.common.debug('set callback ref, 2');
          callbackRef.current = resolve;
        }
        setIsWebViewActive(true);
        setUsedNetworks((prev) => [...new Set([...prev, networkId])]);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      } else if ((cardanoRef.current as unknown as any).checkWebViewReady()) {
        debugLogger.common.debug(
          'webview exist, just call resolve function, 3',
        );
        resolve();
      }
    };

    appUIEventBus.on(AppUIEventBusNames.EnsureChainWebEmbed, onCheckWebView);
    return () => {
      appUIEventBus.off(AppUIEventBusNames.EnsureChainWebEmbed, onCheckWebView);
    };
  }, []);

  useEffect(() => {
    const onCloseChainWebEmbed = () => {
      cardanoRef.current = null;
      callbackRef.current = undefined;
      setIsWebViewActive(false);
      setUsedNetworks([]);
      debugLogger.common.debug('Destroy Cardano WebView');
    };
    appUIEventBus.on(
      AppUIEventBusNames.ChainWebEmbedDisabled,
      onCloseChainWebEmbed,
    );
    return () => {
      appUIEventBus.off(
        AppUIEventBusNames.ChainWebEmbedDisabled,
        onCloseChainWebEmbed,
      );
    };
  }, []);

  const content = useMemo(() => {
    debugLogger.common.debug('Parent ChainView Render');
    if (isWebViewActive && usedNetworks.includes(OnekeyNetwork.ada)) {
      debugLogger.common.debug('Parent Web View Render');
      return (
        <CardanoWebEmbedView ref={cardanoRef} callback={webviewCallback} />
      );
    }
    return null;
  }, [isWebViewActive, webviewCallback, usedNetworks]);

  return content;
}

export default memo(ChainWebEmbed);
