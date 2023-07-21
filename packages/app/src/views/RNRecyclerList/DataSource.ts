interface DataSourceListener {
  onPush?(item: any): void;

  onUnshift?(item: any): void;

  onSplice?(start: number, deleteCount: number, ...items: any[]): void;

  onSetDirty?(): void;

  onMoveUp?(index: number): void;

  onMoveDown?(index: number): void;

  onSet?(index: number, item: any): void;
}

export default class DataSource<T> {
  private _data: T[];

  private _keyExtractor: (item: T, index: number) => string;

  private _listeners: DataSourceListener[];

  constructor(data?: T[], keyExtractor?: (item: T, index: number) => string) {
    this._data = data || [];
    this._keyExtractor =
      keyExtractor ||
      ((item: T, index: number) => `${JSON.stringify(item)}_${index}`);
    this._listeners = [];

    if (!keyExtractor) {
      console.warn(
        "RecyclerViewList/DataSource: missing keyExtractor, it's strongly recommended to specify a keyExtractor function " +
          'in order to use all the features correctly.',
      );

      this._keyExtractor = (item: T, index: number) =>
        `${JSON.stringify(item)}_${index}`;
    }
  }

  push(item: T) {
    this._data.push(item);

    this._listeners.forEach((listener) => {
      if (listener?.onPush) {
        listener.onPush(item);
      }
    });
  }

  unshift(item: T) {
    this._data.unshift(item);

    this._listeners.forEach((listener) => {
      if (listener?.onUnshift) {
        listener.onUnshift(item);
      }
    });
  }

  splice(start: number, deleteCount: number, ...items: T[]) {
    this._data.splice(start, deleteCount, ...items);

    this._listeners.forEach((listener) => {
      if (listener?.onSplice) {
        listener.onSplice(start, deleteCount, ...items);
      }
    });
  }

  size() {
    return this._data.length;
  }

  moveUp(index: number) {
    if (index <= 0) {
      return;
    }

    const item = this._data[index];
    this._data[index] = this._data[index - 1];
    this._data[index - 1] = item;

    this._listeners.forEach((listener) => {
      if (listener?.onMoveUp) {
        listener.onMoveUp(index);
      }
    });
  }

  moveDown(index: number) {
    if (index >= this._data.length - 1) {
      return;
    }

    const item = this._data[index];
    this._data[index] = this._data[index + 1];
    this._data[index + 1] = item;

    this._listeners.forEach((listener) => {
      if (listener?.onMoveDown) {
        listener.onMoveDown(index);
      }
    });
  }

  set(index: number, item: T) {
    this._data[index] = item;

    this._listeners.forEach((listener) => {
      if (listener?.onSet) {
        listener.onSet(index, item);
      }
    });
  }

  setDirty() {
    this._listeners.forEach((listener) => {
      if (listener?.onSetDirty) {
        listener.onSetDirty();
      }
    });
  }

  get(index: number) {
    return this._data[index];
  }

  getKey(item: T, index: number) {
    return this._keyExtractor(item, index);
  }

  _addListener(listener: DataSourceListener) {
    this._listeners.push(listener);
  }

  _removeListener(listener: DataSourceListener) {
    const index = this._listeners.indexOf(listener);
    if (index > -1) {
      this._listeners.splice(index, 1);
    }
  }
}
