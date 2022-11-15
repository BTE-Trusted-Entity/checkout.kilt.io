import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Identicon } from '@polkadot/react-identicon';

import { PayPalButtons } from '@paypal/react-paypal-js';
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
  PurchaseUnit,
} from '@paypal/paypal-js';

import ky from 'ky';

import * as styles from './Transaction.module.css';

import { TxContext } from '../../utilities/TxContext';
import { paths } from '../../../backend/endpoints/paths';
import { useShowOverlay } from '../../utilities/ShowOverlayContext';

function getCostAsLocaleString(cost: string) {
  return parseFloat(cost).toLocaleString(undefined, {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'code',
  });
}

function PurchaseDetails({ purchase }: { purchase: PurchaseUnit }) {
  const total = getCostAsLocaleString(purchase.amount.value);
  const address = purchase.shipping?.address;

  const name = purchase.shipping?.name?.full_name;

  return (
    <section>
      <h2 className={styles.purchaseHeading}>Billing information</h2>

      <dl className={styles.purchaseDetails}>
        <div className={styles.purchaseDetail}>
          <dt className={styles.detailName}>Order total:</dt>
          <dd className={styles.detailValue}>{total}</dd>
        </div>

        {address && (
          <div className={styles.purchaseDetail}>
            <dt className={styles.detailName}>Billing address:</dt>
            <dd className={styles.detailValue}>
              {name && <span>{name}</span>}
              {address.address_line_1 && <span>{address.address_line_1}</span>}
              {address.address_line_2 && <span>{address.address_line_2}</span>}
              {address.postal_code && (
                <span>{`${address.postal_code} ${address.admin_area_1}`}</span>
              )}
              <span>{address.country_code}</span>
            </dd>
          </div>
        )}
      </dl>

      <h2 className={styles.servicesHeading}>
        Congratulations! Now you can start building and using your digital
        identity with KILT services:
      </h2>

      <ul className={styles.services}>
        <li>
          Give your DID a custom name using{' '}
          <a className={styles.serviceLink} href="https://w3n.id/">
            web3name
          </a>
          .
        </li>
        <li>
          Add credentials to your DID such as social media accounts, GitHub and
          email address using{' '}
          <a className={styles.serviceLink} href="https://socialkyc.io/">
            SocialKYC
          </a>
          .
        </li>
        <li>
          Sign digital files with your DID in a secure, decentralized way using{' '}
          <a className={styles.serviceLink} href="https://didsign.io/">
            DIDsign
          </a>
          .
        </li>
        <li>
          Link your DID to your Polkadot ecosystem addresses (and soon,
          Ethereum)
        </li>
      </ul>
    </section>
  );
}

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
  const { address, tx } = useContext(TxContext);

  const cost = useCost();

  const [status, setStatus] = useState<TransactionStatus>('prepared');

  const { showOverlay } = useShowOverlay();

  useEffect(() => {
    if (['authorizing', 'submitting'].includes(status)) {
      showOverlay(true);
    } else {
      showOverlay(false);
    }
  }, [status, showOverlay]);

  const [purchaseDetails, setPurchaseDetails] = useState<PurchaseUnit>();

  const [enabled, setEnabled] = useState(false);
  const handleTermsClick = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setEnabled(event.target.checked);
    },
    [],
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
      setStatus('authorizing');
      const { orderID } = data;

      if (!actions.order) {
        throw new Error('Order not found');
      }

      actions.order
        .authorize()
        .then((authorization) => {
          const payments = authorization.purchase_units[0].payments;

          if (!payments || !payments.authorizations) {
            throw new Error('Missing payment authorization');
          }

          const authorizationID = payments.authorizations[0].id as string;

          setStatus('submitting');

          return ky
            .post(paths.submit, {
              json: { orderID, authorizationID, tx },
              timeout: false,
            })
            .json<PurchaseUnit>();
        })
        .then((captured) => {
          setPurchaseDetails(captured);
          setStatus('complete');
        })
        .catch((error) => {
          setStatus('error');
          console.error(error);
        });
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

  const costAsLocaleString = getCostAsLocaleString(cost);

  return (
    <form className={styles.container}>
      <h2 className={styles.heading}>Purchase Process</h2>

      {status !== 'complete' && (
        <p className={styles.txPrepared}>Transaction prepared</p>
      )}

      {status === 'complete' && (
        <p className={styles.txComplete}>Order complete</p>
      )}

      <section className={styles.addressContainer}>
        <div
          className={status === 'complete' ? styles.identicon : styles.pending}
        >
          <Identicon value={address} size={50} theme="polkadot" />
        </div>

        <p className={styles.address}>
          <span className={styles.addressName}>For account address</span>
          <span className={styles.addressValue}>{address}</span>
        </p>
      </section>

      {status !== 'complete' && (
        <section className={styles.incomplete}>
          <p className={styles.instruction}>
            To complete your order, please first accept the{' '}
            <a href="#" className={styles.termsLink}>
              Terms and Conditions
            </a>{' '}
          </p>

          <p className={enabled ? styles.termsLineEnabled : styles.termsLine}>
            <label className={styles.termsLabel}>
              <input
                className={styles.accept}
                type="checkbox"
                onChange={handleTermsClick}
                checked={enabled}
              />
              <span className={styles.checkbox} />
              <span className={styles.termsLabelText}>
                I accept the Terms and Conditions of the Checkout Service.
              </span>
            </label>
          </p>

          <p className={styles.instruction}>then continue with PayPal</p>

          <p className={styles.cost}>
            <span>Total cost</span>
            <span className={styles.costValue}>{costAsLocaleString}</span>
          </p>

          <div className={styles.paypal}>
            <PayPalButtons
              fundingSource="paypal"
              disabled={!enabled}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={handlePayPalError}
            />
          </div>
        </section>
      )}

      {status === 'complete' && purchaseDetails && (
        <PurchaseDetails purchase={purchaseDetails} />
      )}
    </form>
  );
}
