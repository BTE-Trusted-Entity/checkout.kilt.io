import { ServerRoute } from '@hapi/hapi';
import got from 'got';

import { logger } from '../utilities/logger';
import { trackConnectionState } from '../utilities/trackConnectionState';

import { configuration } from '../utilities/configuration';

import { blockchainConnectionState } from '../utilities/initKilt';

import { getAccessToken } from './submit';

import { paths } from './paths';

const payPalConnectionState = trackConnectionState(10 * 60 * 1000);
const TXDConnectionState = trackConnectionState(10 * 60 * 1000);

async function canAccessPayPal() {
  try {
    await getAccessToken();
    payPalConnectionState.on();
  } catch (error) {
    payPalConnectionState.off();
    logger.error(error, 'Error connecting to PayPal');
    throw error;
  }
}

function checkPayPalConnection() {
  setInterval(
    async () => {
      try {
        await canAccessPayPal();
      } catch {}
    },
    5 * 60 * 1000,
  );
}

async function canAccessTXD() {
  const { TXDBaseUrl, externalHttpTimeout } = configuration;
  try {
    await got(`${TXDBaseUrl}/meta`, { timeout: externalHttpTimeout });
    TXDConnectionState.on();
  } catch (error) {
    TXDConnectionState.off();
    logger.error(error, 'Error connecting to TXD');
    throw error;
  }
}

function checkTXDConnection() {
  setInterval(
    async () => {
      try {
        await canAccessTXD();
      } catch {}
    },
    5 * 60 * 1000,
  );
}

export async function testLiveness() {
  await canAccessPayPal();
  checkPayPalConnection();

  await canAccessTXD();
  checkTXDConnection();
}

export const liveness: ServerRoute = {
  method: 'GET',
  path: paths.liveness,
  options: { auth: false },
  handler: () => {
    return (
      !payPalConnectionState.isOffForTooLong() &&
      !TXDConnectionState.isOffForTooLong() &&
      !blockchainConnectionState.isOffForTooLong()
    );
  },
};
