import { Text } from '../Text';

import type { ITextProps } from '../Text';

type IListViewFooterProps = ITextProps;

export function ListViewFooter({ children, ...rest }: IListViewFooterProps) {
  return (
    <Text px="$5" mt="$3" variant="$bodySm" color="$textSubdued" {...rest}>
      {children}
    </Text>
  );
}
