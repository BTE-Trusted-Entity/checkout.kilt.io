import inert from '@hapi/inert';
import pino from 'hapi-pino';

import { staticFiles } from './endpoints/staticFiles';

import { configuration } from './utilities/configuration';
import { configureDevErrors } from './utilities/configureDevErrors';
import { exitOnError } from './utilities/exitOnError';
import { manager, server } from './utilities/manager';

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
  await server.register(logger);
  await configureDevErrors(server);
  server.logger.info('Server configured');

  server.route(staticFiles);
  server.logger.info('Routes configured');

  await manager.start();
})().catch(exitOnError);
