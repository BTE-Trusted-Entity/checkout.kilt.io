import { Request, ResponseToolkit, ServerRoute } from '@hapi/hapi';

import { configuration } from '../utilities/configuration';

import { paths } from './paths';

export const paypalClientID: ServerRoute = {
  method: 'GET',
  path: paths.paypalClientID,
  handler: (request: Request, h: ResponseToolkit) => {
    return h.response(configuration.paypal.clientId);
  },
};
