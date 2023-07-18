import { readFile } from 'node:fs/promises';

import type { ServerRoute } from '@hapi/hapi';

import { configuration } from '../utilities/configuration';

import { paths } from './paths';

export interface Configuration {
  costs: {
    did: string;
    w3n: string;
  };
  paypalClientID: string;
}

const data: Configuration = {
  costs: {
    did: configuration.didCost,
    w3n: configuration.w3nCost,
  },
  paypalClientID: configuration.paypal.clientId,
};

const script = '<script type="application/json" id="configuration">';
const replacement = `${script}${JSON.stringify(data)}`;

export const home: ServerRoute = {
  method: 'GET',
  path: paths.home,
  handler: async (request, h) => {
    const html = await readFile(
      `${configuration.distFolder}/index.html`,
      'utf8',
    );
    const output = html.replace(script, replacement);
    return h.response(output);
  },
  options: {
    tags: ['noLogs'],
  },
};
