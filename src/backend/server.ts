import inert from '@hapi/inert';
import pino from 'hapi-pino';

import { costs } from './endpoints/costs';
import { paypalClientID } from './endpoints/paypalClientID';

import { staticFiles } from './endpoints/staticFiles';

import { configuration } from './utilities/configuration';
import { configureAuthentication } from './utilities/configureAuthentication';
import { configureDevErrors } from './utilities/configureDevErrors';
import { exitOnError } from './utilities/exitOnError';
import { manager, server } from './utilities/manager';
import { submit } from './endpoints/submit';
import { liveness, testLiveness } from './endpoints/liveness';
import { initKilt } from './utilities/initKilt';

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

  await configureAuthentication(server);
  await configureDevErrors(server);
  server.logger.info('Server configured');

  await initKilt();
  server.logger.info('Blockchain connection initialized');

  await testLiveness();
  server.logger.info('Liveness tests passed');

  server.route(paypalClientID);
  server.route(costs);
  server.route(submit);

  server.route(liveness);

  server.route(staticFiles);

  server.logger.info('Routes configured');

  await manager.start();
})().catch(exitOnError);
