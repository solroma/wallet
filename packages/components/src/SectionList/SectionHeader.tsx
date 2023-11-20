import { XStack } from '../Stack';
import { Text } from '../Text';

import type { XStackProps } from 'tamagui';

interface ISectionHeaderProps extends XStackProps {
  title: string;
  headerRight?: React.ReactNode;
}

export function SectionHeader({
  title,
  headerRight,
  ...rest
}: ISectionHeaderProps) {
  return (
    <XStack alignItems="center" px="$5" py="$2" {...rest}>
      <Text variant="$headingSm" color="$textSubdued" flex={1}>
        {title}
      </Text>
      {headerRight && headerRight}
    </XStack>
  );
}
