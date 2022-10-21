import { ServerRoute } from '@hapi/hapi';

export const home: ServerRoute = {
  method: 'GET',
  path: '/',
  handler: () => 'Hello World',
};
