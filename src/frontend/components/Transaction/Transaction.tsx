import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Identicon } from '@polkadot/react-identicon';

import { PayPalButtons } from '@paypal/react-paypal-js';

import ky from 'ky';

import * as styles from './Transaction.module.css';

import { TxContext } from '../../utilities/TxContext';
import { paths } from '../../../backend/endpoints/paths';

function useCost() {
  const [cost, setCost] = useState<string>();

  useEffect(() => {
    (async () => {
      setCost(await ky.get(paths.cost).text());
    })();
  }, []);

  return cost;
}

export function Transaction(): JSX.Element | null {
  const { address } = useContext(TxContext);

  const cost = useCost();

  const [status] = useState<
    'prepared' | 'paymentAuthorized' | 'complete' | 'error'
  >('prepared');

  const [enabled, setEnabled] = useState(false);
  const handleTermsClick = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setEnabled(event.target.checked);
    },
    [],
  );

  if (!cost) {
    return null;
  }

  const costAsLocaleString = parseFloat(cost).toLocaleString(undefined, {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'code',
  });

  return (
    <form className={styles.container}>
      <h1 className={styles.heading}>Purchase Process</h1>

      {status === 'prepared' && (
        <p className={styles.txPrepared}>Transaction prepared</p>
      )}

      {status === 'complete' && (
        <p className={styles.txComplete}>Order complete</p>
      )}

      <section className={styles.addressContainer}>
        <div
          className={status === 'complete' ? styles.complete : styles.pending}
        >
          <Identicon value={address} size={50} theme="polkadot" />
        </div>

        <p className={styles.address}>
          <span className={styles.addressName}>For account address</span>
          <span className={styles.addressValue}>{address}</span>
        </p>
      </section>

      <p className={styles.instruction}>
        To complete your order, please first accept the Terms and Conditions
      </p>

      <p className={enabled ? styles.termsLineEnabled : styles.termsLine}>
        <label className={styles.termsLabel}>
          <input
            className={styles.agree}
            type="checkbox"
            onChange={handleTermsClick}
            checked={enabled}
          />
          <span />
          <span className={styles.termsLabelText}>
            I accept the{' '}
            <a href="#" className={styles.termsLink}>
              Terms and Conditions
            </a>{' '}
            of the Checkout Service.
          </span>
        </label>
      </p>

      <p className={styles.instruction}>then continue with PayPal*</p>

      <p className={styles.cost}>
        <span>Total cost</span>
        <span className={styles.costValue}>{costAsLocaleString}</span>
      </p>

      <div className={styles.paypal}>
        <PayPalButtons fundingSource="paypal" disabled={!enabled} />
      </div>

      <p className={styles.footnote}>*PayPal account required</p>
    </form>
  );
}
