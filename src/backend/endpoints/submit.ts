import { randomUUID } from 'node:crypto';

import { z } from 'zod';
import {
  Request,
  ResponseObject,
  ResponseToolkit,
  ServerRoute,
} from '@hapi/hapi';

import got from 'got';

import { OrderResponseBody } from '@paypal/paypal-js';

import { configuration } from '../utilities/configuration';

import { submitTx } from '../utilities/submitTx';

import { paths } from './paths';

export async function getAccessToken() {
  const { baseUrl, clientId, secret } = configuration.paypal;

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const { access_token } = await got
    .post(`${baseUrl}/v1/oauth2/token`, {
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })
    .json<{ access_token: string }>();

  return access_token;
}

async function getOrderDetails(orderID: string, accessToken: string) {
  const { baseUrl } = configuration.paypal;

  return await got(`${baseUrl}/v2/checkout/orders/${orderID}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).json<OrderResponseBody>();
}

async function capture(authorizationID: string, accessToken: string) {
  const { baseUrl } = configuration.paypal;
  const uuid = randomUUID();

  await got.post(
    `${baseUrl}/v2/payments/authorizations/${authorizationID}/capture`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'PayPal-Request-Id': uuid,
      },
      json: {
        soft_descriptor: 'KILT DID',
      },
    },
  );
}

const zodPayload = z.object({
  orderID: z.string(),
  authorizationID: z.string(),
  tx: z.string(),
});

async function handler(
  request: Request,
  h: ResponseToolkit,
): Promise<ResponseObject> {
  const { logger } = request;
  logger.debug('Submit transaction started');

  const { orderID, authorizationID, tx } = request.payload as z.infer<
    typeof zodPayload
  >;

  const accessToken = await getAccessToken();

  logger.debug('Generated PayPal access token');

  const order = await getOrderDetails(orderID, accessToken);

  logger.debug('Fetched PayPal order details, sending transaction to TXD');

  await submitTx(tx);

  logger.debug('Capturing payment');

  await capture(authorizationID, accessToken);

  logger.debug('Successfully captured payment');

  const purchase = order.purchase_units[0];
  return h.response(purchase);
}

export const submit: ServerRoute = {
  method: 'POST',
  path: paths.submit,
  handler,
  options: {
    validate: {
      payload: async (payload) => zodPayload.parse(payload),
    },
  },
};
