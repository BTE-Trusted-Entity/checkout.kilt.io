import { Utils } from '@kiltprotocol/sdk-js';

import { configuration } from './configuration';

export function makeKeypair() {
  const { seedPhrase } = configuration;
  return Utils.Crypto.makeKeypairFromUri(seedPhrase + '//did//0', 'sr25519');
}
