import { ServerRoute } from '@hapi/hapi';

import { configuration } from '../utilities/configuration';

import { paths } from './paths';

export interface Output {
  did: string;
  w3n: string;
}

const response: Output = {
  did: configuration.didCost,
  w3n: configuration.w3nCost,
};

export const costs: ServerRoute = {
  method: 'GET',
  path: paths.costs,
  handler: (request, h) => h.response(response),
  options: { cors: true, auth: false },
};