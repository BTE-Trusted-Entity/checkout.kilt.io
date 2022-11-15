import { Keyring } from '@polkadot/api';
import {
  blake2AsHex,
  blake2AsU8a,
  cryptoWaitReady,
} from '@polkadot/util-crypto';
import base64url from 'base64url';
import got from 'got';
import Boom from '@hapi/boom';

import { configuration } from './configuration';
import { logger } from './logger';

function createJWS(endpoint: string, body?: string): string {
  const { seedPhrase } = configuration;

  const keyring = new Keyring({ type: 'sr25519' });
  keyring.setSS58Format(38);
  const authKey = keyring.addFromUri(seedPhrase + '//did//0');

  const authKeyHash = blake2AsHex(
    new Uint8Array([
      0x00 /* PublicVerificationKey */,
      0x01 /* Sr25519 */,
      ...authKey.publicKey,
    ]),
    256,
  );

  const kid = `did:kilt:${authKey.address}#${authKeyHash}`;

  const data = `${endpoint}${body || ''}`;
  const hash = blake2AsU8a(data, 256);

  const sig = authKey.sign(hash);
  const header: string = base64url(JSON.stringify({ kid }));
  const payload: string = base64url(Buffer.from(hash));
  const signature: string = base64url(Buffer.from(sig));

  return `${header}.${payload}.${signature}`;
}

export async function submitTx(tx: string) {
  await cryptoWaitReady();
  const { TXDBaseUrl } = configuration;

  const { id } = await got
    .post(`${TXDBaseUrl}/api/v1/submission`, {
      body: tx,
      headers: {
        Authorization: `Bearer ${createJWS('/api/v1/submission', tx)}`,
      },
    })
    .json<{ id: string }>();

  logger.debug('Transaction sent to TXD, polling status');

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const data = await got(`${TXDBaseUrl}/api/v1/submission/${id}`, {
      headers: {
        Authorization: `Bearer ${createJWS(`/api/v1/submission/${id}`)}`,
      },
    }).json<{
      status: 'Pending' | 'InBlock' | 'Finalized' | 'Failed';
    }>();

    if (data.status === 'Pending') {
      logger.debug('Transaction pending');
    }

    if (data.status === 'InBlock') {
      logger.debug('Transaction in block');
    }

    if (data.status === 'Failed') {
      logger.error('Transaction failed');
      throw Boom.badRequest();
    }

    if (data.status === 'Finalized') {
      logger.debug('Transaction finalized');
      break;
    }
  }
}
