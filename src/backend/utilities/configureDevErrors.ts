import { Server } from '@hapi/hapi';
import devErrors from 'hapi-dev-errors';

import { configuration } from './configuration';

export async function configureDevErrors(server: Server): Promise<void> {
  if (!configuration.isProduction) {
    const options = { showErrors: true };
    await server.register({ plugin: devErrors, options });
  }
}
