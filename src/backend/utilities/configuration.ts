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

const TXDBaseUrl = env.BASE_URI_TXD;

if (!TXDBaseUrl) {
  throw new ConfigurationError('No TXD URL provided');
}

const didCost = env.COST_DID;

if (!didCost) {
  throw new ConfigurationError('No DID cost provided');
}
if (Number.isNaN(parseFloat(didCost))) {
  throw new ConfigurationError('DID cost is not a number');
}

const paypal = {
  baseUrl: env.BASE_URI_PAYPAL,
  clientId: env.CLIENT_ID_PAYPAL,
  secret: env.SECRET_PAYPAL,
};

if (!paypal.baseUrl || !paypal.clientId || !paypal.secret) {
  throw new ConfigurationError('No paypal client credentials provided');
}

const seedPhrase = env.SECRET_SEED_PHRASE;
if (!seedPhrase) {
  throw new ConfigurationError('No seed phrase provided');
}

export const configuration = {
  baseUri,
  port: env.PORT || 3000,
  isProduction: env.NODE_ENV === 'production',
  distFolder: path.join(cwd(), 'dist', 'frontend'),
  httpAuthPassword,
  didCost,
  paypal,
  TXDBaseUrl,
  seedPhrase,
};
