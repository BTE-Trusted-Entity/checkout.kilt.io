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

import { configuration } from '../utilities/configuration';

import { submitTx } from '../utilities/submitTx';

import { sendConfirmationEmail } from '../utilities/emailHandler';

import { getExtrinsicType } from '../utilities/getExtrinsicType';

import { isAcceptedTx } from '../utilities/isAcceptedTx';

import { paths } from './paths';

export async function getAccessToken() {
  const {
    externalHttpTimeout,
    paypal: { baseUrl, clientId, secret },
  } = configuration;

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const { access_token } = await got
    .post(`${baseUrl}/v1/oauth2/token`, {
      body: 'grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
      timeout: externalHttpTimeout,
    })
    .json<{ access_token: string }>();

  return access_token;
}

async function getOrderDetails(orderID: string, accessToken: string) {
  const {
    externalHttpTimeout,
    paypal: { baseUrl },
  } = configuration;

  return await got(`${baseUrl}/v2/checkout/orders/${orderID}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    timeout: externalHttpTimeout,
  }).json<OrderResponseBody>();
}

async function capture(authorizationID: string, accessToken: string) {
  const {
    externalHttpTimeout,
    paypal: { baseUrl },
  } = configuration;

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
      timeout: externalHttpTimeout,
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

  const txType = await getExtrinsicType(tx);

  if (!isAcceptedTx(txType)) {
    const error = `Unsupported transaction ${txType}`;
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
    const error = `Unexpected payment amount: ${paidAmount.value} ${paidAmount.currency_code}`;
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
      txType,
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
