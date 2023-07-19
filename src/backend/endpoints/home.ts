import { readFile } from 'node:fs/promises';

import type { ServerRoute } from '@hapi/hapi';

import { polkadotIcon } from '@polkadot/ui-shared';

import { configuration } from '../utilities/configuration';

import { paths } from './paths';

export interface Configuration {
  costs: {
    did: string;
    w3n: string;
  };
  paypalClientID: string;
  isTestEnvironment: boolean;
  polkadotIconCircles: ReturnType<typeof polkadotIcon>;
}

const data: Configuration = {
  costs: {
    did: configuration.didCost,
    w3n: configuration.w3nCost,
  },
  paypalClientID: configuration.paypal.clientId,
  isTestEnvironment: configuration.isTestEnvironment,
  polkadotIconCircles: [],
};

const script = '<script type="application/json" id="configuration">';

export const home: ServerRoute = {
  method: 'GET',
  path: paths.home,
  handler: async (request, h) => {
    const { address } = request.query;
    const polkadotIconCircles = polkadotIcon(address, { isAlternative: false });

    const fullData = { ...data, polkadotIconCircles };
    const replacement = `${script}${JSON.stringify(fullData)}`;

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
