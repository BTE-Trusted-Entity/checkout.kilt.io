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

import * as Boom from '@hapi/boom';

import { ConfigService } from '@kiltprotocol/config';

import { configuration } from '../utilities/configuration';

import { submitTx } from '../utilities/submitTx';

import { sendConfirmationEmail } from '../utilities/emailHandler';

import { paths } from './paths';

const ACCEPTED_TRANSACTIONS = ['did.create', 'web3Names.claim'] as const;

type AcceptedTx = (typeof ACCEPTED_TRANSACTIONS)[number];

function isAcceptedTx(tx: string): tx is AcceptedTx {
  return ACCEPTED_TRANSACTIONS.includes(tx as AcceptedTx);
}

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

  const { intent, status, payer, purchase_units } = await getOrderDetails(
    orderID,
    accessToken,
  );

  if (intent !== 'AUTHORIZE' || status !== 'COMPLETED') {
    throw Boom.badRequest();
  }

  const api = ConfigService.get('api');

  const decoded = api.tx(api.createType('Call', tx));
  const { section, method } = api.registry.findMetaCall(decoded.callIndex);
  const txType = `${section}.${method}`;

  if (!isAcceptedTx(txType)) {
    const error = 'Unsupported transaction';
    logger.error(error);
    throw Boom.badRequest(error);
  }

  const { didCost, w3nCost } = configuration;

  const paidAmount = purchase_units[0].amount;
  const expectedAmount = txType === 'did.create' ? didCost : w3nCost;

  const isExpectedAmount =
    parseFloat(paidAmount.value) === parseFloat(expectedAmount);
  const isExpectedCurrency = paidAmount.currency_code === 'EUR';

  if (!isExpectedAmount || !isExpectedCurrency) {
    const error = 'Unexpected payment amount';
    logger.error(error);
    throw Boom.badRequest(error);
  }

  logger.debug('Fetched PayPal order details, sending transaction to TXD');

  await submitTx(tx);

  logger.debug('Capturing payment');

  await capture(authorizationID, accessToken);

  logger.debug('Successfully captured payment');

  if (payer.email_address) {
    await sendConfirmationEmail(
      payer.email_address,
      payer.name?.given_name || payer.name?.surname || 'Customer',
    );
  }

  return h.response().code(204);
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
