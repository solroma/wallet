import type { ComponentProps } from 'react';
import { forwardRef, memo, useMemo } from 'react';

import { Pressable as NBPressable } from 'native-base';

import platformEnv from '@onekeyhq/shared/src/platformEnv';

import { useBeforeOnPress } from '../utils/useBeforeOnPress';

export type PressableItemProps = ComponentProps<typeof NBPressable>;

const PressableCapture = forwardRef<typeof NBPressable, PressableItemProps>(
  ({ onPress, ...props }: PressableItemProps, ref) => {
    const onPressOverride = useBeforeOnPress(onPress);

    const styles = useMemo(() => {
      if (platformEnv.isDesktop) {
        const style = typeof props.style === 'object' ? props.style : {};
        return {
          ...style,
          WebkitAppRegion: 'no-drag',
        };
      }
      return props.style;
    }, [props.style]);

    return (
      <NBPressable
        ref={ref}
        {...props}
        style={styles}
        onPress={props.disabled ? null : onPressOverride}
        // @ts-ignore
        cursor={props.disabled ? 'not-allowed' : 'pointer'}
      />
    );
  },
);

PressableCapture.displayName = 'Pressable';

export default memo(PressableCapture);
