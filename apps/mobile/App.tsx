/* eslint-disable @typescript-eslint/no-unused-vars, import/first, import/order */
import '@onekeyhq/shared/src/polyfills';
import LazyLoad from '@onekeyhq/shared/src/lazyLoad';

const KitProvider = LazyLoad(() => import('@onekeyhq/kit'));

export default KitProvider;
