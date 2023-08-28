import type { FC } from 'react';

import { Icon as NBIcon } from 'native-base';

import Icon from '../Icon';
import SvgCheckBoxIconChecked from '../Icon/react/mini/CheckBoxIconChecked';
import SvgCheckBoxIconCheckedDisable from '../Icon/react/mini/CheckBoxIconCheckedDisable';
import SvgCheckBoxIconDefault from '../Icon/react/mini/CheckBoxIconDefault';
import SvgCheckBoxIconDefaultDisable from '../Icon/react/mini/CheckBoxIconDefaultDisable';

type Props = {
  disable: boolean;
  defaultIsChecked: boolean;
  indeterminate: boolean;
};
export const getCheckBoxIcon = ({
  disable,
  defaultIsChecked,
  indeterminate,
}: Props) => {
  if (disable) {
    if (defaultIsChecked) {
      return (
        <NBIcon
          as={SvgCheckBoxIconDefaultDisable}
          color="interactive-disabled"
        />
      );
    }
    return (
      <NBIcon as={SvgCheckBoxIconCheckedDisable} color="interactive-disabled" />
    );
  }

  if (defaultIsChecked) {
    return <NBIcon as={SvgCheckBoxIconDefault} color="interactive-default" />;
  }

  if (indeterminate) {
    return (
      <NBIcon as={SvgCheckBoxIconDefaultDisable} color="interactive-default" />
    );
  }

  return <NBIcon as={SvgCheckBoxIconChecked} color="interactive-default" />;
};

export const CheckBoxIcon: FC<Props> = ({
  disable,
  defaultIsChecked,
  indeterminate,
}) => {
  if (disable) {
    if (defaultIsChecked) {
      return (
        <Icon
          name="CheckBoxIconDefaultDisableMini"
          color="icon-default"
          size={12}
        />
      );
    }
    return (
      <Icon
        name="CheckBoxIconCheckedDisableMini"
        color="icon-default"
        size={12}
      />
    );
  }

  if (defaultIsChecked) {
    return (
      <Icon name="CheckBoxIconDefaultMini" color="icon-on-primary" size={12} />
    );
  }

  if (indeterminate) {
    return (
      <Icon
        name="CheckBoxIconDefaultDisableMini"
        color="icon-on-primary"
        size={12}
      />
    );
  }

  return (
    <Icon name="CheckBoxIconCheckedMini" color="icon-on-primary" size={12} />
  );
};
