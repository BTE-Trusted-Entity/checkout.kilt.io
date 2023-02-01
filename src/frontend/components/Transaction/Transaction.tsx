import type {
  CreateOrderActions,
  CreateOrderData,
  OnApproveActions,
  OnApproveData,
} from '@paypal/paypal-js';

import { ChangeEvent, FormEvent, useCallback, useState } from 'react';

import ky, { HTTPError } from 'ky';

import { PayPalButtons } from '@paypal/react-paypal-js';

import * as styles from './Transaction.module.css';

import { useTxParams } from '../../utilities/TxContext/TxContext';
import { paths } from '../../../backend/endpoints/paths';
import { useCosts } from '../../../backend/endpoints/costsApi';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

import { getCostAsLocaleString } from '../../utilities/getCostAsLocaleString/getCostAsLocaleString';

import {
  FlowError,
  TransactionStatus,
  TransactionTemplate,
} from './TransactionTemplate';

export function Transaction(): JSX.Element | null {
  const { tx, web3name } = useTxParams();

  const costs = useCosts();
  const cost = web3name ? costs?.w3n : costs?.did;

  const [status, setStatus] = useState<TransactionStatus>('prepared');
  const [flowError, setFlowError] = useState<FlowError>();

  const enabled = useBooleanState();
  const bound = useBooleanState();

  const handleTermsClick = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      enabled.set(checked);

      if (!checked) {
        bound.off();
      }
    },
    [bound, enabled],
  );

  const handleBindClick = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      bound.on();
    },
    [bound],
  );

  const createOrder = useCallback(
    (data: CreateOrderData, actions: CreateOrderActions) => {
      if (!cost) {
        throw new Error('Missing cost');
      }
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: cost,
            },
          },
        ],
      });
    },
    [cost],
  );

  const onApprove = useCallback(
    async (data: OnApproveData, actions: OnApproveActions) => {
      (async () => {
        try {
          setStatus('authorizing');

          const { orderID } = data;

          if (!actions.order) {
            throw new Error('Order not found');
          }

          const authorization = await actions.order.authorize();
          const payments = authorization.purchase_units[0].payments;

          if (!payments || !payments.authorizations) {
            throw new Error('Missing payment authorization');
          }

          const authorizationID = payments.authorizations[0].id as string;

          setStatus('submitting');

          await ky.post(paths.submit, {
            json: { orderID, authorizationID, tx },
            timeout: false,
          });

          setStatus('complete');
        } catch (exception) {
          setStatus('error');
          if (
            exception instanceof HTTPError &&
            [502, 504].includes(exception.response.status)
          ) {
            setFlowError('txd');
          } else {
            setFlowError('unknown');
          }
        }
      })();
    },
    [tx],
  );

  const handlePayPalError = useCallback((error: Record<string, unknown>) => {
    console.error(error);
    setStatus('error');
    setFlowError('paypal');
  }, []);

  const handleRestart = useCallback(() => {
    setStatus('prepared');
    setFlowError(undefined);
  }, []);

  if (!cost) {
    return null;
  }

  return (
    <TransactionTemplate
      status={status}
      enabled={enabled.current}
      bound={bound.current}
      cost={getCostAsLocaleString(cost)}
      handleTermsClick={handleTermsClick}
      handleBindClick={handleBindClick}
      handleRestart={handleRestart}
      flowError={flowError}
    >
      <div className={styles.paypal}>
        <PayPalButtons
          fundingSource="paypal"
          disabled={!enabled.current || !bound.current}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={handlePayPalError}
        />
      </div>
    </TransactionTemplate>
  );
}
