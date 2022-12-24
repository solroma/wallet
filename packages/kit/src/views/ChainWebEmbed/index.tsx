import { memo, useEffect, useMemo, useState } from 'react';

import { useGeneral } from '@onekeyhq/kit/src/hooks/redux';
import {
  AppUIEventBusNames,
  appUIEventBus,
} from '@onekeyhq/shared/src/eventBus/appUIEventBus';
import debugLogger from '@onekeyhq/shared/src/logger/debugLogger';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

import { CardanoWebEmbedView } from './CardanoWebEmbedView';

function ChainWebEmbed() {
  const { activeNetworkId } = useGeneral();
  const [webEmbedDisabled, setWebEmbedDisabled] = useState(false);
  const [lazyLoad, setLazyLoad] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLazyLoad(true);
    }, 3000);
  }, []);

  useEffect(() => {
    const onCloseChainWebEmbed = (disabled: boolean) => {
      setWebEmbedDisabled(disabled);
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
    if (!platformEnv.isNative) return null;

    debugLogger.common.debug('chainWebEmbed Rerender ========>>>>>');

    if (webEmbedDisabled) {
      debugLogger.common.debug('distroy webview');
      return null;
    }

    if (!activeNetworkId) return null;

    if (activeNetworkId === 'ada--0' && lazyLoad) {
      debugLogger.common.debug('webembed Rerender ========<<<<<<');
      return <CardanoWebEmbedView />;
    }
    return null;
  }, [activeNetworkId, lazyLoad, webEmbedDisabled]);

  return content;
}

export default memo(ChainWebEmbed);
