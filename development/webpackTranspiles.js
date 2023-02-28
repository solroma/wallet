const webModuleTranspile = [
  'moti',
  '@gorhom',
  '@mysten/sui.js',
  'superstruct',
  '@polkadot',
  '@noble/curves',
  '@solana/web3.js',
  '@kaspa/core-lib',
  '@zondax/izari-filecoin',
  '@onekeyhq',
];

const extModuleTranspile = [
  'react-native-animated-splash-screen',
  'moti',
  'popmotion',
  '@mysten/sui.js',
  'superstruct',
  '@noble/curves',
  '@polkadot/api',
  '@polkadot/wasm-bridge',
  '@polkadot/types-codec',
  '@polkadot/rpc-provider',
  '@polkadot/rpc-core',
  '@polkadot/types',
  '@polkadot/util-crypto',
  '@polkadot/keyring',
  '@solana/web3.js',
  '@zondax/izari-filecoin',
  '@kaspa/core-lib',
  '@onekeyhq/blockchain-libs',
  '@onekeyhq/components',
  '@onekeyhq/kit',
  '@onekeyhq/kit-bg',
  '@onekeyhq/shared',
  '@onekeyhq/engine',
  '@onekeyhq/app',
];

module.exports = {
  webModuleTranspile,
  extModuleTranspile,
};
