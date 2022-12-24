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
  const [lazyLoad, setLazyLoad] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLazyLoad(true);
    }, 3000);
  }, []);

  useEffect(() => {
    const onCloseChainWebEmbed = (disabled: boolean) => {
      setTimeout(
        () => {
          setLazyLoad(!disabled);
        },
        disabled ? 0 : 3000,
      );
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

    debugLogger.common.debug('chain parent Rerender ========>>>>>');

    // if (webEmbedDisabled) {
    //   debugLogger.common.debug('distroy webview');
    //   return null;
    // }

    if (!activeNetworkId) return null;

    if (activeNetworkId === 'ada--0' && lazyLoad) {
      debugLogger.common.debug('webembed Rerender ========<<<<<<');
      return <CardanoWebEmbedView />;
    }
    return null;
  }, [activeNetworkId, lazyLoad]);

  return content;
}

export default memo(ChainWebEmbed);
