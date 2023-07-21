import type { ServerRoute } from '@hapi/hapi';
import type { KiltAddress } from '@kiltprotocol/sdk-js';

import got from 'got';

import { configuration } from '../utilities/configuration';

import { paths } from './paths';

export interface Output {
  did: string; // property hardcoded in Sporran & w3n.id
  w3n: string; // property hardcoded in Sporran & w3n.id
  paymentAddress: KiltAddress; // property hardcoded in Sporran & w3n.id
}

const response: Promise<Output> = (async () => {
  const { TXDBaseUrl } = configuration;
  const { paymentAddress } = await got(`${TXDBaseUrl}/meta`).json<{
    paymentAddress: KiltAddress;
  }>();

  return {
    did: configuration.didCost,
    w3n: configuration.w3nCost,
    paymentAddress,
  };
})();

export const costs: ServerRoute = {
  method: 'GET',
  path: paths.costs,
  handler: async (request, h) => h.response(await response),
  options: { cors: true, auth: false },
};
