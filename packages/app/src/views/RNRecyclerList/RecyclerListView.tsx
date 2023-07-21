/* eslint-disable import/no-import-module-exports */
// eslint-disable-next-line max-classes-per-file

import type { ReactElement } from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { requireNativeComponent } from 'react-native';

import type DataSource from './DataSource';
import type { ViewStyle } from 'react-native';

interface RecyclerViewItemProps<T> {
  style: ViewStyle;
  itemIndex: number;
  shouldUpdate: boolean;
  dataSource: DataSource<T>;
  renderItem: (args: { item: T; index: number }) => JSX.Element;
  header?: JSX.Element;
  separator?: JSX.Element;
  footer?: JSX.Element;
}

const NativeRecyclerViewItemView = requireNativeComponent(
  'RecyclerViewItemView',
);

const RecyclerViewItem = <T,>({
  itemIndex,
  dataSource,
  renderItem,
  header,
  separator,
  footer,
  shouldUpdate,
}: RecyclerViewItemProps<T>) => {
  const element = useCallback(
    () =>
      renderItem({
        item: dataSource.get(itemIndex),
        index: itemIndex,
      }),
    [shouldUpdate, itemIndex, dataSource.get(itemIndex)],
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    <NativeRecyclerViewItemView itemIndex={itemIndex}>
      {header}
      {element}
      {separator}
      {footer}
    </NativeRecyclerViewItemView>
  );
};

interface RecyclerViewProps<T> {
  dataSource: DataSource<T>;
  renderItem: (args: { item: T; index: number }) => JSX.Element;
  windowSize?: number;
  initialListSize?: number;
  initialScrollIndex?: number;
  onVisibleItemsChange?: (info: {
    firstIndex: number;
    lastIndex: number;
  }) => void;
}

const RecyclerView = <T,>({
  dataSource,
  renderItem,
  windowSize = 10,
  initialListSize = 30,
  initialScrollIndex,
  onVisibleItemsChange,
}: RecyclerViewProps<T>) => {
  const viewRef = useRef<any>(null);

  const scrollToIndex = ({
    index,
    animated = true,
  }: {
    index: number;
    animated?: boolean;
  }) => {
    // scrollToIndex logic
  };

  useEffect(() => {
    if (initialScrollIndex) {
      scrollToIndex({
        index: initialScrollIndex,
        animated: false,
      });
    }
  }, [initialScrollIndex]);

  const onVisibleItemsChangeNative = (event: any) => {
    const { firstIndex, lastIndex } = event.nativeEvent;

    // update state

    if (onVisibleItemsChange) {
      onVisibleItemsChange({ firstIndex, lastIndex });
    }
  };

  return (
    <RecyclerViewItem
      ref={viewRef}
      dataSource={dataSource}
      renderItem={renderItem}
      onVisibleItemsChange={onVisibleItemsChangeNative}
    />
  );
};

const nativeOnlyProps = {
  nativeOnly: {
    onVisibleItemsChange: true,
    itemCount: true,
  },
};

const NativeRecyclerView = requireNativeComponent(
  'RecyclerListView',
  RecyclerView,
  nativeOnlyProps,
);
export default NativeRecyclerView;
