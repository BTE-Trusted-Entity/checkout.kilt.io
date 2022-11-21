import type {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
  PurchaseUnit,
} from '@paypal/paypal-js';

import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import ky from 'ky';

import { PayPalButtons } from '@paypal/react-paypal-js';

import * as styles from './Transaction.module.css';

import { TxContext } from '../../utilities/TxContext/TxContext';
import { paths } from '../../../backend/endpoints/paths';
import { useBooleanState } from '../../utilities/useBooleanState/useBooleanState';

import { getCostAsLocaleString } from '../../utilities/getCostAsLocaleString/getCostAsLocaleString';

import { TransactionTemplate } from './TransactionTemplate';

function useCost() {
  const [cost, setCost] = useState<string>();

  useEffect(() => {
    (async () => {
      setCost(await ky.get(paths.cost).text());
    })();
  }, []);

  return cost;
}

type TransactionStatus =
  | 'prepared'
  | 'authorizing'
  | 'submitting'
  | 'complete'
  | 'error';

export function Transaction(): JSX.Element | null {
  const { tx } = useContext(TxContext);

  const cost = useCost();

  const [status, setStatus] = useState<TransactionStatus>('prepared');

  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseUnit>();

  const enabled = useBooleanState();
  const handleTermsClick = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      enabled.set(event.target.checked);
    },
    [enabled],
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

          const captured = await ky
            .post(paths.submit, {
              json: { orderID, authorizationID, tx },
              timeout: false,
            })
            .json<PurchaseUnit>();

          setPurchaseDetails(captured);
          setStatus('complete');
        } catch (error) {
          setStatus('error');
          console.error(error);
        }
      })();
    },
    [tx],
  );

  // TODO: https://kiltprotocol.atlassian.net/browse/SK-1376
  const handlePayPalError = useCallback((error: Record<string, unknown>) => {
    console.error(error);
  }, []);

  if (!cost) {
    return null;
  }

  return (
    <TransactionTemplate
      status={status}
      enabled={enabled.current}
      cost={getCostAsLocaleString(cost)}
      handleTermsClick={handleTermsClick}
      purchaseDetails={purchaseDetails}
    >
      <div className={styles.paypal}>
        <PayPalButtons
          fundingSource="paypal"
          disabled={!enabled}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={handlePayPalError}
        />
      </div>
    </TransactionTemplate>
  );
}
