import platformEnv from '@onekeyhq/shared/src/platformEnv';

export type WebHandler = 'browser' | 'tabbedWebview';
export const webHandler: WebHandler = (() => {
  if (platformEnv.isDesktop || platformEnv.isNative) {
    return 'tabbedWebview';
  }
  return 'browser';
})();
