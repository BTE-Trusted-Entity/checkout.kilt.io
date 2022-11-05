import { cwd } from 'node:process';
import path from 'node:path';

import dotenv from 'dotenv';
import pino from 'pino';

dotenv.config();

class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    pino().fatal(message);
    process.exit(1);
  }
}

const { env } = process;

const httpAuthPassword = env.SECRET_HTTP_AUTH_PASSWORD;

const baseUri = env.BASE_URI;
if (!baseUri) {
  throw new ConfigurationError('No base URI provided');
}

if (!env.COST_DID) {
  throw new ConfigurationError('No DID cost provided');
}
const didCost = parseFloat(env.COST_DID);
if (Number.isNaN(didCost)) {
  throw new ConfigurationError('DID cost is not a number');
}

export const configuration = {
  baseUri,
  port: env.PORT || 3000,
  isProduction: env.NODE_ENV === 'production',
  distFolder: path.join(cwd(), 'dist', 'frontend'),
  httpAuthPassword,
  didCost,
};
