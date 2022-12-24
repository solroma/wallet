import { memo, useEffect, useMemo, useState } from 'react';

import { useGeneral } from '@onekeyhq/kit/src/hooks/redux';
import {
  AppUIEventBusNames,
  appUIEventBus,
} from '@onekeyhq/shared/src/eventBus/appUIEventBus';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

import { CardanoWebEmbedView } from './CardanoWebEmbedView';

function ChainWebEmbed() {
  const { activeNetworkId } = useGeneral();
  const [webEmbedDisabled, setWebEmbedDisabled] = useState(false);

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

    if (webEmbedDisabled) {
      console.log('distroy webview');
      return null;
    }

    if (!activeNetworkId) return null;

    if (activeNetworkId === 'ada--0') {
      return <CardanoWebEmbedView />;
    }
    return null;
  }, [activeNetworkId, webEmbedDisabled]);

  return content;
}

export default memo(ChainWebEmbed);
