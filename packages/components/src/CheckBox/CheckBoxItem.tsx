import { type FC, useCallback } from 'react';

import Pressable from '../Pressable';
import useTheme from '../Provider/hooks/useTheme';

import { CheckBoxIcon } from './CheckBoxIcon';

type Props = {
  isDisabled?: boolean;
  isChecked?: boolean;
  defaultIsChecked?: boolean;
  onChange?: (isSelected: boolean) => void;
  isIndeterminate?: boolean;
  focusable?: boolean;
};

export const CheckBoxItem: FC<Props> = ({
  isDisabled,
  defaultIsChecked = false,
  isChecked,
  onChange,
  isIndeterminate,
  focusable,
}) => {
  const { themeVariant } = useTheme();
  const onPress = useCallback(() => {
    onChange?.(!isChecked);
  }, [isChecked, onChange]);

  const bgColor = themeVariant === 'light' ? '#FFFFFF' : undefined;
  return (
    <Pressable
      focusable={focusable}
      justifyContent="center"
      alignItems="center"
      padding="2px"
      onPress={onPress}
      size="20px"
      borderWidth={isChecked ? 0 : '2px'}
      borderRadius="md"
      borderColor="border-default"
      bgColor={isChecked ? 'action-primary-hovered' : bgColor}
      _hover={{
        borderColor: '#737373',
      }}
      _disabled={{
        opacity: 1,
        bg: isChecked ? 'interactive-disabled' : 'action-primary-disabled',
        borderColor: isChecked
          ? 'interactive-disabled'
          : 'checkbox-border-disabled',
      }}
      isDisabled={isDisabled}
    >
      {isChecked && (
        <CheckBoxIcon
          defaultIsChecked={defaultIsChecked}
          disable={Boolean(isDisabled)}
          indeterminate={Boolean(isIndeterminate)}
        />
      )}
    </Pressable>
  );
};
