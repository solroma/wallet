import { memo, useMemo } from 'react';

import { useIntl } from 'react-intl';

import { Box, HStack, IconButton, Typography } from '@onekeyhq/components';
import { useActiveWalletAccount } from '@onekeyhq/kit/src/hooks';
import { OnekeyNetwork } from '@onekeyhq/shared/src/config/networkIds';

import { showHomeNFTSettings } from '../../../Overlay/HomeNFTSettings';

const NFTListHeader = () => {
  const intl = useIntl();
  const { networkId, accountId } = useActiveWalletAccount();

  const isBtcNetwork = useMemo(
    () => networkId === OnekeyNetwork.btc || networkId === OnekeyNetwork.tbtc,
    [networkId],
  );

  return (
    <Box flexDirection="column" paddingRight="16px">
      <HStack
        space={4}
        alignItems="center"
        justifyContent="space-between"
        pb={3}
      >
        <Typography.Heading>
          {intl.formatMessage({ id: 'title__assets' })}
        </Typography.Heading>
        {isBtcNetwork ? (
          <IconButton
            name="Cog8ToothMini"
            size="sm"
            type="plain"
            onPress={() => showHomeNFTSettings({ accountId, networkId })}
          />
        ) : null}
      </HStack>
    </Box>
  );
};

export default memo(NFTListHeader);
