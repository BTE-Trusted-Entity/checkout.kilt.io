import {
  ChangeEventHandler,
  Fragment,
  MouseEventHandler,
  useContext,
  useEffect,
  useRef,
} from 'react';

import { PurchaseUnit } from '@paypal/paypal-js';

import * as styles from './Transaction.module.css';

import { TxContext } from '../../utilities/TxContext/TxContext';
import { Avatar } from '../Avatar/Avatar';
import { getCostAsLocaleString } from '../../utilities/getCostAsLocaleString/getCostAsLocaleString';

function PurchaseDetails({ purchase }: { purchase: PurchaseUnit }) {
  const address = purchase.shipping?.address;

  const name = purchase.shipping?.name?.full_name;

  return (
    <section>
      <h2 className={styles.purchaseHeading}>Billing information</h2>

      <dl className={styles.purchaseDetails}>
        <div className={styles.purchaseDetail}>
          <dt className={styles.detailName}>Order total:</dt>
          <dd className={styles.detailValue}>
            {getCostAsLocaleString(purchase.amount.value)}
          </dd>
        </div>

        {address && (
          <address className={styles.purchaseDetail}>
            <dt className={styles.detailName}>Billing address:</dt>
            <dd className={styles.detailValue}>
              {name && <span>{name}</span>}
              {address.address_line_1 && <span>{address.address_line_1}</span>}
              {address.address_line_2 && <span>{address.address_line_2}</span>}
              {address.postal_code && (
                <span>
                  {address.postal_code} {address.admin_area_1}
                </span>
              )}
              <span>{address.country_code}</span>
            </dd>
          </address>
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
        </li>
        <li>
          Add credentials to your DID such as social media accounts, GitHub and
          email address using{' '}
          <a className={styles.serviceLink} href="https://socialkyc.io/">
            SocialKYC
          </a>
        </li>
        <li>
          Sign digital files with your DID in a secure, decentralized way using{' '}
          <a className={styles.serviceLink} href="https://didsign.io/">
            DIDsign
          </a>
        </li>
        <li>
          Link your DID to your Polkadot ecosystem addresses (and soon,
          Ethereum)
        </li>
      </ul>
    </section>
  );
}

export type TransactionStatus =
  | 'prepared'
  | 'authorizing'
  | 'submitting'
  | 'complete'
  | 'error';

export type FlowError = 'paypal' | 'txd' | 'unknown';

interface Props {
  children: JSX.Element;
  status: TransactionStatus;
  enabled: boolean;
  cost: string;
  handleTermsClick: ChangeEventHandler;
  handleRestart: MouseEventHandler;
  purchaseDetails?: PurchaseUnit;
  flowError?: FlowError;
}

export function TransactionTemplate({
  children,
  status,
  enabled,
  cost,
  handleTermsClick,
  handleRestart,
  purchaseDetails,
  flowError,
}: Props) {
  const { address } = useContext(TxContext);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (['authorizing', 'submitting'].includes(status) && !dialog.open) {
      dialog.showModal();
    }
    if (['prepared', 'complete', 'error'].includes(status) && dialog.open) {
      dialog.close();
    }
  }, [status]);

  return (
    <form className={styles.container}>
      <h2 className={styles.heading}>Purchase Process</h2>

      {['prepared', 'authorizing', 'submitting'].includes(status) && (
        <Fragment>
          <p className={styles.txPrepared}>Transaction prepared</p>

          <section className={styles.addressContainer}>
            <Avatar address={address} isOnChain={status === 'complete'} />

            <p className={styles.address}>
              <span className={styles.addressName}>For account address</span>
              <span className={styles.addressValue}>{address}</span>
            </p>
          </section>

          <section className={styles.incomplete}>
            <p className={styles.instruction}>
              To complete your order, please first accept the{' '}
              {/* TODO: Add link to terms and conditions */}
              <a href="#" className={styles.termsLink}>
                Terms and Conditions
              </a>
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
              <span className={styles.costValue}>{cost}</span>
            </p>

            {children}
          </section>
        </Fragment>
      )}

      {status === 'complete' && purchaseDetails && (
        <Fragment>
          <p className={styles.txComplete}>Order complete</p>
          <PurchaseDetails purchase={purchaseDetails} />
        </Fragment>
      )}

      {status === 'error' && (
        <Fragment>
          <p className={styles.txError}>Error</p>
          {flowError === 'paypal' && (
            <p>
              Something went wrong during your PayPal payment. Your account was
              not debited. Please restart the payment process.
            </p>
          )}

          {flowError === 'txd' && (
            <p>
              Something went wrong during the blockchain transaction. Your
              account was not debited. Please restart the payment process.
            </p>
          )}

          {flowError === 'unknown' && (
            <p>
              Some unexpected error happened. Please check your internet
              connection and make sure to follow the exact steps of the payment
              process.
            </p>
          )}

          <p>Please try again.</p>
          <button className={styles.restart} onClick={handleRestart}>
            Restart
          </button>
        </Fragment>
      )}

      <dialog className={styles.dialog} ref={dialogRef}>
        Please wait while your transaction is being processed
      </dialog>
    </form>
  );
}
