import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { IEVMNFTItemType } from '../NFTList/type';

export type SelectAsset = IEVMNFTItemType['content'] & {
  selected?: boolean;
  selectAmount?: string;
};
export type ISendNFTContentData = {
  multiSelect?: boolean;
  listData: SelectAsset[];
};

export type ISendNFTContent = {
  context: ISendNFTContentData;
  setContext: Dispatch<SetStateAction<ISendNFTContentData>>;
};

const SendNFTContent = createContext<ISendNFTContent | null>(null);

function SendNFTContentProvider(
  props: ISendNFTContentData & { children: ReactNode },
) {
  const { children, listData, multiSelect } = props;
  const [context, setContext] = useState<ISendNFTContentData>({
    multiSelect: false,
    listData: [],
  });

  useEffect(() => {
    setContext((ctx) => ({
      ...ctx,
      listData,
      multiSelect,
    }));
  }, [multiSelect, listData]);

  const contextValue = useMemo(() => ({ context, setContext }), [context]);
  return (
    <SendNFTContent.Provider value={contextValue}>
      {children}
    </SendNFTContent.Provider>
  );
}

function useSendNFTContent() {
  return useContext(SendNFTContent);
}

export { SendNFTContentProvider, useSendNFTContent };
