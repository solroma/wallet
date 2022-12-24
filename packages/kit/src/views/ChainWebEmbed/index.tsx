import { memo, useEffect, useMemo, useState } from 'react';

import { useGeneral } from '@onekeyhq/kit/src/hooks/redux';
import debugLogger from '@onekeyhq/shared/src/logger/debugLogger';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

import { CardanoWebEmbedView } from './CardanoWebEmbedView';

function ChainWebEmbed() {
  const { activeNetworkId } = useGeneral();
  const [lazyLoad, setLazyLoad] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLazyLoad(true);
    }, 500);
  }, []);

  const content = useMemo(() => {
    if (!platformEnv.isNative) return null;

    debugLogger.common.debug('chainWebEmbed Rerender ========>>>>>');

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
