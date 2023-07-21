import type { ComponentProps, FC } from 'react';
import { memo } from 'react';

import NBPressable from './Pressable';

export type PressableItemProps = ComponentProps<typeof NBPressable>;

const PressableItem: FC<PressableItemProps> = ({
  children,
  onPress,
  ...props
}) => {
  // TODO: use child function to check hover state
  return (
    <NBPressable
      px={{ base: '4', lg: '6' }}
      py={4}
      _hover={{
        bg: 'surface-hovered',
      }}
      _focus={{
        bg: 'surface-hovered',
      }}
      _focusVisible={{
        bg: 'surface-hovered',
      }}
      _pressed={{
        bg: 'surface-pressed',
        borderColor: 'surface-pressed',
      }}
      bg="surface-default"
      {...props}
      onPress={onPress}
    >
      {children}
    </NBPressable>
  );
};

export default memo(PressableItem);
