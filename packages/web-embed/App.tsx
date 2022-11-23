/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';

// import { Provider } from '@onekeyhq/kit';

import * as CardanoWasm from '@emurgo/cardano-serialization-lib-asmjs';
import BigNumber from 'bignumber.js';
import {
  HashRouter, // HashRouter BrowserRouter
  Link,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import { Box, Button, Provider } from '@onekeyhq/components';
import { wait } from '@onekeyhq/kit/src/utils/helper';
import { ONBOARDING_WEBVIEW_METHODS } from '@onekeyhq/kit/src/views/Onboarding/screens/CreateWallet/BehindTheScene/consts';
import ProcessAutoTyping, {
  IProcessAutoTypingRef,
} from '@onekeyhq/kit/src/views/Onboarding/screens/CreateWallet/BehindTheScene/ProcessAutoTyping';
import platformEnv from '@onekeyhq/shared/src/platformEnv';
// css should be imported at last
import '@onekeyhq/shared/src/web/index.css';

import type { IJsonRpcRequest } from '@onekeyfe/cross-inpage-provider-types';

function useRouteQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function RootLayout(props: any) {
  return <div {...props} />;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Home() {
  return (
    <div>
      Hello world,
      <ul>
        <li>
          <Link to="/abc">to ABC</Link>
        </li>
        <li>
          <Link to="/onboarding/auto_typing">to Auto-typing</Link>
        </li>
      </ul>
    </div>
  );
}

function HomeAbc() {
  return (
    <div>
      ABC
      <div>
        <Link to="/">Back home</Link>
      </div>
    </div>
  );
}

function OnboardingAutoTyping() {
  const query = useRouteQuery();
  const typingRef = useRef<IProcessAutoTypingRef | null>(null);
  if (platformEnv.isDev) {
    // @ts-ignore
    window.$onboardingAutoTypingRef = typingRef;
  }
  useEffect(() => {
    if (!window.$onekey) {
      return;
    }
    const handler = (payload: IJsonRpcRequest) => {
      console.log('OnboardingAutoTyping handler: ', payload);
      if (
        payload &&
        payload.method === ONBOARDING_WEBVIEW_METHODS.onboardingWalletCreated
      ) {
        typingRef.current?.handleWalletCreated();
      }
    };
    window.$onekey.$private.on('message_low_level', handler);
    return () => {
      window.$onekey.$private.off('message_low_level', handler);
    };
  }, []);
  const onPressFinished = useCallback(async () => {
    try {
      await window.$onekey.$private.request({
        method: ONBOARDING_WEBVIEW_METHODS.onboardingPressFinishButton,
      });
      await wait(3000);
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
    return Promise.resolve();
  }, []);
  const pausedProcessIndex = useMemo(() => {
    const index = query.get('pausedProcessIndex');
    const indexBN = new BigNumber(index ?? '');
    if (indexBN.isNaN()) {
      return 1;
    }
    return indexBN.toNumber();
  }, [query]);
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      onClick={() => {
        if (platformEnv.isDev) {
          typingRef.current?.handleWalletCreated();
        }
      }}
      id="WebOnboardingAutoTypingContainer"
      style={{ overflow: 'auto' }}
    >
      <Box h="full" minH="100vh" justifyContent="center">
        <ProcessAutoTyping
          ref={typingRef}
          minHeight={0}
          pausedProcessIndex={pausedProcessIndex}
          onPressFinished={onPressFinished}
        />
      </Box>
    </div>
  );
}

function CardanoProvider() {
  const getTxHash = () => {
    const txHex =
      '84a30081825820ea255fd8a913845b8eb211b344452af2343b601562a03ddce8513f5596aedf110401828258390014be7487f7e9168698db46675e40c11229f5e3dc1cb5db67393db69e5f735581d56949f21b140b3a0500fc771343aea705dc0e4f32688b571a002dc6c082583900c1203567a5745d0fbfe9ab2d07dfbac7937b6849f8b99b35d43228fc721672afdf411c7c621568f1504a3a51b45c207b5c4d5f49cba13b2d1a0ea3487b021a00029075a0f5f6';
    const rawTx = CardanoWasm.Transaction.from_hex(txHex);
    const hash = CardanoWasm.hash_transaction(rawTx.body());
    console.log('tx hash web-embed: ', hash);
    return hash.to_hex();
  };
  useEffect(() => {
    console.log('will Register !');
    console.log('window.$onekey: ', window.$onekey);
    if (!window.$onekey) {
      return;
    }
    const handler = async (payload: IJsonRpcRequest) => {
      console.log('CardanoProvider Recive Message: ', payload);
      console.log('params: ', JSON.stringify(payload.params));
      if (payload.method === '$private_mock_method') {
        await window.$onekey.$private.request({
          method: 'fakeResponseMethod',
          promiseId: (payload.params as any).promiseId,
          data: {
            txHash: getTxHash(),
          },
        });
      }
    };
    console.log('Register Message Handler for $private');
    window.$onekey.$private.on('message_low_level', handler);
    return () => {
      console.log('cancel registe');
      window.$onekey.$private.off('message_low_level', handler);
    };
  }, []);

  return (
    <Box>
      Hello World
      <Button
        onPress={() => {
          console.log('Hello World');
        }}
      >
        Button
      </Button>
    </Box>
  );
}

// @ts-ignore
const appSettings = window.WEB_EMBED_ONEKEY_APP_SETTINGS || {
  themeVariant: 'light',
  localeVariant: 'en-US',
  enableHaptics: true,
};

const App: FC = function () {
  return (
    <Provider
      themeVariant={appSettings.themeVariant}
      locale={appSettings.localeVariant}
      hapticsEnabled={appSettings.enableHaptics}
      waitFontLoaded={false}
    >
      <HashRouter>
        <Routes>
          {/* TODO jian guo pro3 NOT support hash route init */}
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<OnboardingAutoTyping />} />
          <Route path="/abc" element={<HomeAbc />} />
          <Route
            path="/onboarding/auto_typing"
            element={<OnboardingAutoTyping />}
          />
          <Route path="/cardano" element={<CardanoProvider />} />
        </Routes>
      </HashRouter>
    </Provider>
  );
};

export default App;
