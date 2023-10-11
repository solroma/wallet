import { useCallback, useMemo, useRef, useState } from 'react';

import { useNavigation } from '@react-navigation/core';
import BigNumber from 'bignumber.js';
import { useIntl } from 'react-intl';
import { StyleSheet } from 'react-native';

import {
  Box,
  Button,
  CustomSkeleton,
  HStack,
  IconButton,
  ScrollView,
  Text,
  ToastManager,
  Typography,
  VStack,
  useIsVerticalLayout,
} from '@onekeyhq/components';
import useModalClose from '@onekeyhq/components/src/Modal/Container/useModalClose';
import { copyToClipboard } from '@onekeyhq/components/src/utils/ClipboardUtils';
import { getWalletIdFromAccountId } from '@onekeyhq/engine/src/managers/account';
import { getContentWithAsset } from '@onekeyhq/engine/src/managers/nft';
import { WALLET_TYPE_WATCHING } from '@onekeyhq/engine/src/types/wallet';
import NFTDetailMenu from '@onekeyhq/kit/src/views/Overlay/NFTDetailMenu';
import debugLogger from '@onekeyhq/shared/src/logger/debugLogger';
import platformEnv from '@onekeyhq/shared/src/platformEnv';

import backgroundApiProxy from '../../../../../../background/instance/backgroundApiProxy';
import { useNetwork, useWallet } from '../../../../../../hooks';
import { ModalRoutes, RootRoutes } from '../../../../../../routes/routesEnum';
import { deviceUtils } from '../../../../../../utils/hardware';
import { generateUploadNFTParams } from '../../../../../../utils/hardware/nftUtils';
import CollectionLogo from '../../../../../NFTMarket/CollectionLogo';
import { SendModalRoutes } from '../../../../../Send/enums';
import { showAmountInputDialog } from '../../../AmountInputDialog';
import { ENFTCollectionType } from '../../../NFTList/type';
import { DetailItem } from '../DetailItem';
import { useDeviceMenu } from '../hooks/useDeviceMenu';

import type { CollectiblesRoutesParams } from '../../../../../../routes/Root/Modal/Collectibles';
import type { ModalScreenProps } from '../../../../../../routes/types';
import type {
  IEVMNFTCollectionType,
  IEVMNFTItemType,
} from '../../../NFTList/type';
import type { DeviceUploadResourceParams } from '@onekeyfe/hd-core';

type NavigationProps = ModalScreenProps<CollectiblesRoutesParams>;

function EVMAssetDetailContent({
  asset,
  isOwner,
  networkId,
  accountId,
  collection,
}: {
  asset: IEVMNFTItemType['content'];
  isOwner: boolean;
  networkId: string;
  accountId?: string;
  collection: IEVMNFTCollectionType['content'];
}) {
  const intl = useIntl();
  const navigation = useNavigation<NavigationProps['navigation']>();

  const walletId = useMemo(() => {
    if (accountId) {
      return getWalletIdFromAccountId(accountId);
    }
    return null;
  }, [accountId]);

  const { wallet } = useWallet({ walletId });
  const modalClose = useModalClose();
  const isVertical = useIsVerticalLayout();
  const isDisabled = useMemo(() => {
    if (wallet?.type === WALLET_TYPE_WATCHING || !accountId) {
      return true;
    }
    if (
      asset.collectionType === ENFTCollectionType.ERC721 &&
      asset.holderAddress !== asset.accountAddress
    ) {
      return true;
    }
    return false;
  }, [accountId, asset, wallet?.type]);

  const { network } = useNetwork({ networkId });

  const [menuLoading, setMenuLoading] = useState(false);
  const hardwareCancelFlagRef = useRef(false);
  const { device, showMenu } = useDeviceMenu({ wallet, asset });

  const sendNFTWithAmount = useCallback(
    async (amount: string) => {
      const { accountAddress } = asset ?? {};
      if (!networkId || !accountAddress) {
        return;
      }
      const account =
        await backgroundApiProxy.serviceAccount.getAccountByAddress({
          networkId,
          address: accountAddress ?? '',
        });
      if (!account) {
        return;
      }
      navigation.navigate(RootRoutes.Modal, {
        screen: ModalRoutes.Send,
        params: {
          screen: SendModalRoutes.PreSendAddress,
          params: {
            accountId: account?.id,
            networkId,
            isNFT: true,
            from: '',
            to: '',
            amount,
            token: asset.collectionId,
            nftTokenId: asset.itemId,
            nftType:
              asset.collectionType === ENFTCollectionType.ERC721
                ? 'erc721'
                : 'erc1155',
            closeModal: modalClose,
          },
        },
      });
    },
    [asset, modalClose, navigation, networkId],
  );

  const sendAction = useCallback(() => {
    if (asset.amount && new BigNumber(asset.amount).gt(1)) {
      showAmountInputDialog({
        total: asset.amount,
        onConfirm: (amount) => {
          sendNFTWithAmount(amount);
        },
      });
      return;
    }
    sendNFTWithAmount('1');
  }, [asset, sendNFTWithAmount]);

  const onCollectToTouch = useCallback(async () => {
    let uri;
    if (asset.metadata?.image) {
      uri = asset.metadata?.image;
    } else {
      uri = getContentWithAsset({ contentUri: asset.metadata?.image });
    }

    if (!uri) return;

    setMenuLoading(true);
    let uploadResParams: DeviceUploadResourceParams | undefined;
    try {
      uploadResParams = await generateUploadNFTParams(uri, {
        header:
          asset.name && asset.name.length > 0 ? asset.name : `#${asset.itemId}`,
        subheader: asset.metadata?.description ?? '',
        network: network?.name ?? '',
        owner: asset.holderAddress,
      });
      debugLogger.hardwareSDK.info('should upload: ', uploadResParams);
    } catch (e) {
      debugLogger.hardwareSDK.info('image operate error: ', e);
      ToastManager.show(
        {
          title: intl.formatMessage({ id: 'msg__image_download_failed' }),
        },
        {
          type: 'error',
        },
      );
      setMenuLoading(false);
      return;
    }
    if (uploadResParams && !hardwareCancelFlagRef.current) {
      try {
        await backgroundApiProxy.serviceHardware.uploadResource(
          device?.mac ?? '',
          uploadResParams,
        );
        ToastManager.show({
          title: intl.formatMessage({ id: 'msg__change_saved' }),
        });
      } catch (e) {
        deviceUtils.showErrorToast(e);
      } finally {
        setMenuLoading(false);
      }
    }
  }, [asset, device, intl, network]);

  return (
    <VStack space="24px" mb="50px">
      {/* Asset name and collection name */}
      <Box>
        <HStack alignItems="stretch" justifyContent="space-between">
          <Text
            typography={{ sm: 'DisplayLarge', md: 'DisplayLarge' }}
            fontWeight="700"
            isTruncated
            flex={1}
          >
            {asset.name && asset.name.length > 0
              ? asset.name
              : `#${asset.itemId}`}
          </Text>
          {showMenu && (
            <NFTDetailMenu onCollectToTouch={onCollectToTouch}>
              <IconButton
                name="EllipsisVerticalOutline"
                size={isVertical ? 'sm' : 'xs'}
                type="basic"
                circle
                borderWidth={StyleSheet.hairlineWidth}
                borderColor="border-default"
                h={{ base: 34, sm: 30 }}
                ml={3}
                mr={{ base: 0, sm: 10 }}
                isLoading={menuLoading}
                isDisabled={menuLoading}
              />
            </NFTDetailMenu>
          )}
        </HStack>
      </Box>

      {/* Collection */}
      {!!network && collection && (
        <HStack
          px="16px"
          py="12px"
          rounded="12px"
          space="12px"
          borderWidth={StyleSheet.hairlineWidth}
          alignItems="center"
          borderColor="border-default"
          bgColor="action-secondary-default"
        >
          {collection ? (
            <CollectionLogo
              src={collection.logoURI}
              width="40px"
              height="40px"
            />
          ) : (
            <CustomSkeleton width="40px" height="40px" borderRadius="12px" />
          )}
          <Box flex={1}>
            <Text typography="Body1Strong">{collection.name}</Text>
          </Box>
        </HStack>
      )}

      {isOwner && (
        <HStack space="16px">
          <Button
            type="primary"
            isDisabled={isDisabled}
            width="full"
            size="lg"
            leftIconName="ArrowUpMini"
            onPress={sendAction}
          >
            {intl.formatMessage({
              id: 'action__send',
            })}
          </Button>
          {/* More button in future */}
        </HStack>
      )}

      {/* Description */}
      {!!asset.metadata?.description && (
        <Typography.Body2 color="text-subdued">
          {asset.metadata?.description}
        </Typography.Body2>
      )}

      {/* traits */}
      {!!asset.metadata?.attributes?.length && (
        <VStack space="16px">
          <Typography.Heading>
            {intl.formatMessage({ id: 'content__attributes' })}
          </Typography.Heading>
          {platformEnv.isNative ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              mb="-8px"
              mx="-16px"
              pl="16px"
            >
              {asset?.metadata?.attributes.map((trait, index) => (
                <Box
                  key={`${trait.trait_type}-${index}`}
                  px="12px"
                  py="8px"
                  mr="8px"
                  mb="8px"
                  bgColor="surface-neutral-subdued"
                  borderRadius="12px"
                >
                  <HStack justifyContent="space-between" mb="4px">
                    <Typography.Caption
                      mr="12px"
                      numberOfLines={1}
                      color="text-subdued"
                    >
                      {trait.trait_type}
                    </Typography.Caption>
                    {/* <Typography.Caption color="text-success"> */}
                    {/*   {trait.percentage} */}
                    {/* </Typography.Caption> */}
                  </HStack>
                  <Typography.Body2Strong>{trait.value}</Typography.Body2Strong>
                </Box>
              ))}
            </ScrollView>
          ) : (
            <Box flexDirection="row" flexWrap="wrap" mb="-8px" mr="-8px">
              {asset.metadata?.attributes?.map((trait, index) => (
                <Box
                  key={`${trait.trait_type}-${index}`}
                  px="12px"
                  py="8px"
                  mr="8px"
                  mb="8px"
                  bgColor="surface-neutral-subdued"
                  borderRadius="12px"
                >
                  <HStack justifyContent="space-between" mb="4px">
                    <Typography.Caption
                      mr="12px"
                      numberOfLines={1}
                      color="text-subdued"
                    >
                      {trait.trait_type}
                    </Typography.Caption>
                    {/* <Typography.Caption color="text-success"> */}
                    {/*   {trait.percentage} */}
                    {/* </Typography.Caption> */}
                  </HStack>
                  <Typography.Body2Strong>{trait.value}</Typography.Body2Strong>
                </Box>
              ))}
            </Box>
          )}
        </VStack>
      )}

      {/* Details */}
      <Box>
        <Typography.Heading mb="16px">
          {intl.formatMessage({ id: 'content__details' })}
        </Typography.Heading>
        <VStack space="16px">
          {!!asset.collectionId && (
            <DetailItem
              title={intl.formatMessage({
                id: 'transaction__contract_address',
              })}
              value={asset.collectionId}
              icon="Square2StackMini"
              onPress={() => {
                copyToClipboard(asset.collectionId ?? '');
                ToastManager.show({
                  title: intl.formatMessage({ id: 'msg__copied' }),
                });
              }}
            />
          )}
          {!!asset.itemId && (
            <DetailItem
              title="NFT ID"
              value={asset.itemId}
              icon="Square2StackMini"
              onPress={() => {
                copyToClipboard(asset.itemId ?? '');
                ToastManager.show({
                  title: intl.formatMessage({ id: 'msg__copied' }),
                });
              }}
            />
          )}
          {!!asset.collectionType && (
            <DetailItem
              title={intl.formatMessage({ id: 'content__nft_standard' })}
              value={
                asset.collectionType === ENFTCollectionType.ERC721
                  ? 'erc721'
                  : 'erc1155'
              }
            />
          )}
          {!!network && (
            <DetailItem
              title={intl.formatMessage({ id: 'content__blockchain' })}
              value={network.name}
            />
          )}
        </VStack>
      </Box>
    </VStack>
  );
}

export { EVMAssetDetailContent };
