import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';

import { configuration } from '../utilities/configuration';

import { paths } from './paths';

export const cost: ServerRoute = {
  method: 'GET',
  path: paths.cost,
  handler: (request: Request, h: ResponseToolkit) => {
    return h.response({ cost: configuration.didCost } as { cost: number });
  },
  options: { cors: true, auth: false },
};
