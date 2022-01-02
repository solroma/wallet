import React, { isValidElement } from 'react';

import Box from '../../Box';
import Button from '../../Button';
import Divider from '../../Divider';
import IconButton from '../../IconButton';
import PresenceTransition from '../../PresenceTransition';
import ScrollView from '../../ScrollView';
import Typography from '../../Typography';

import { renderOptions } from './Option';

import type { ChildProps } from '..';

function Desktop<T>({
  dropdownProps,
  toggleVisible,
  options,
  onChange,
  visible,
  title,
  footer,
  footerText,
  footerIcon,
  onPressFooter,
  activeOption,
  renderItem,
  headerShown,
  dropdownPosition,
  asAction,
}: ChildProps<T>) {
  return (
    <PresenceTransition
      visible={visible}
      initial={{ opacity: 0, translateY: 0 }}
      animate={{
        opacity: 1,
        translateY: 8,
        transition: {
          duration: 150,
        },
      }}
    >
      <Box
        zIndex={999}
        position="absolute"
        width="full"
        right={dropdownPosition === 'right' ? '0' : ''}
        left={dropdownPosition === 'left' ? '0' : ''}
        maxHeight="480px"
        borderRadius="12"
        bg="surface-subdued"
        borderColor="border-subdued"
        borderWidth="1px"
        {...dropdownProps}
      >
        {headerShown ? (
          <>
            <Box
              p="2"
              pl="3"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography.Body2Strong>{title}</Typography.Body2Strong>
              <IconButton
                name="CloseSolid"
                type="plain"
                size="xs"
                onPress={toggleVisible}
                circle
              />
            </Box>
            {!!title && <Divider />}
          </>
        ) : null}
        <ScrollView p="1" flex="1">
          {renderOptions<T>({
            options,
            activeOption,
            renderItem,
            onChange,
            asAction,
          })}
        </ScrollView>
        {isValidElement(footer) || footer === null ? (
          footer
        ) : (
          <>
            <Divider />
            <Box p="1.5">
              <Button
                size="xs"
                type="plain"
                leftIconName={footerIcon}
                onPress={onPressFooter}
              >
                {footerText}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </PresenceTransition>
  );
}

export default Desktop;
