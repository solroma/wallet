/* eslint-disable @typescript-eslint/no-unused-vars, import/first, import/order */
import LazyLoad from '@onekeyhq/shared/src/lazyLoad';
import '@onekeyhq/shared/src/polyfills';

const LazyKitProvider = LazyLoad(() => import('@onekeyhq/kit'));

export default LazyKitProvider;
