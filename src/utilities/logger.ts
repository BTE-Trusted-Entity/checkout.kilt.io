import { pino } from 'pino';
import { configuration } from './configuration.js';

export const logger = pino({
  level: 'debug',
  ...(!configuration.isProduction && {
    level: 'trace',
    transport: {
      target: 'pino-pretty',
    },
  }),
});
