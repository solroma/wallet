import { IconButton } from '../../../actions';

import type { IIconButtonProps } from '../../../actions';

function HeaderIconButton(props: IIconButtonProps) {
  return (
    <IconButton
      variant="tertiary"
      testID="nav-header-icon"
      focusStyle={undefined}
      {...props}
    />
  );
}

export default HeaderIconButton;
