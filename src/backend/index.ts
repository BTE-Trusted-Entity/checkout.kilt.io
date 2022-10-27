import { ServerRegisterPluginObject } from '@hapi/hapi';
import inert from '@hapi/inert';
import pino from 'hapi-pino';

import { home } from './routes/home.js';

import { configuration } from './utilities/configuration.js';
import { configureDevErrors } from './utilities/configureDevErrors.js';
import { exitOnError } from './utilities/exitOnError.js';
import { manager, server } from './utilities/manager.js';

const { isProduction } = configuration;

const logger = {
  plugin: pino,
  options: {
    ...(!isProduction && { transport: { target: 'pino-pretty' } }),
    ignoreTags: ['noLogs'],
    level: isProduction ? 'debug' : 'trace',
    logRequestComplete: isProduction,
    redact: isProduction
      ? [
          'req.headers.authorization',
          'req.headers["x-forwarded-for"]',
          'req.headers["x-real-ip"]',
        ]
      : { paths: ['req', 'res'], remove: true },
  },
};

(async () => {
  await server.register(inert);
  await server.register(logger as ServerRegisterPluginObject<pino.Options>);
  await configureDevErrors(server);
  server.logger.info('Server configured');

  server.route(home);
  server.logger.info('Routes configured');

  await manager.start();
})().catch(exitOnError);
