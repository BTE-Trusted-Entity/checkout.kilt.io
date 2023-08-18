import {
  ChangeEventHandler,
  FormEventHandler,
  Fragment,
  MouseEventHandler,
  PropsWithChildren,
  useEffect,
  useRef,
} from 'react';

import * as styles from './Transaction.module.css';

import { useTxParams } from '../../utilities/TxContext/TxContext';
import { Avatar } from '../Avatar/Avatar';
import { Progress } from '../Progress/Progress';

function AccountAddress({ isOnChain }: { isOnChain: boolean }) {
  const { address, did } = useTxParams();
  if (!address) {
    return null;
  }

  return (
    <section className={styles.addressContainer}>
      {!did && <Avatar isOnChain={isOnChain} />}

      <p className={styles.address}>
        <span className={styles.addressName}>For account address:</span>
        <span className={styles.addressValue}>{address}</span>
      </p>
    </section>
  );
}

function DidLine({ did }: { did?: string }) {
  if (!did) {
    return null;
  }

  return (
    <section className={styles.addressContainer}>
      <p className={styles.address}>
        <span className={styles.addressName}>DID:</span>
        <span className={styles.addressValue}>{did}</span>
      </p>
    </section>
  );
}

function Web3NameLine({ web3name }: { web3name?: string }) {
  if (!web3name) {
    return null;
  }

  return (
    <section className={styles.addressContainer}>
      <p className={styles.address}>
        <span className={styles.addressName}>web3name:</span>
        <span className={styles.web3Name}>w3n:{web3name}</span>
      </p>
    </section>
  );
}

const progressStages = ['Prepare', 'Order', 'Pay', 'Success'];

export type TransactionStatus =
  | 'prepared'
  | 'authorizing'
  | 'submitting'
  | 'complete'
  | 'error';

export type FlowError = 'paypal' | 'txd' | 'unknown';

interface Props {
  status: TransactionStatus;
  enabled: boolean;
  bound: boolean;
  cost: string;
  handleTermsClick: ChangeEventHandler;
  handleBindClick: FormEventHandler<HTMLFormElement>;
  handleRestart: MouseEventHandler;
  flowError?: FlowError;
}

export function TransactionTemplate({
  children,
  status,
  enabled,
  bound,
  cost,
  handleTermsClick,
  handleBindClick,
  handleRestart,
  flowError,
}: PropsWithChildren<Props>) {
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

  const ref = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const currentStage = (() => {
    if (!enabled) return 'Prepare';
    if (!bound) return 'Order';
    if (status !== 'complete') return 'Pay';
    return 'Success';
  })();

  const { did, web3name } = useTxParams();

  return (
    <form className={styles.container} ref={ref} onSubmit={handleBindClick}>
      <Progress stages={progressStages} current={currentStage} />

      <h2 className={styles.heading}>Purchase Process</h2>

      {['prepared', 'authorizing', 'submitting'].includes(status) && (
        <Fragment>
          <p className={styles.txPrepared}>Sporran transaction signed</p>

          <AccountAddress isOnChain={false} />

          <DidLine did={did} />

          <Web3NameLine web3name={web3name} />

          <section className={styles.incomplete}>
            <p className={styles.instruction}>
              The Checkout Service executes your transaction for a{' '}
              {web3name ? 'web3name' : 'DID'} on the KILT blockchain. This
              Service is provided by KILT partner B.T.E. BOTLabs Trusted Entity
              GmbH. You can use PayPal to pay for this Service.
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
                  I agree to immediate processing of the Checkout Service, and
                  am aware that this ends my right to revoke the Service.
                </span>
              </label>
            </p>

            <p className={styles.cost}>
              <span>Service fee (including VAT)</span>
              <span className={styles.costValue}>{cost}</span>
              <span className={styles.costDetails}>
                or EUR equivalent, depending on your preferred PayPal currency
              </span>
            </p>

            <p>
              By clicking the button below, I also agree to the{' '}
              <a href="/terms.html" className={styles.termsLink}>
                Terms and Conditions
              </a>{' '}
              of the Checkout Service.
            </p>

            <p className={styles.orderLine}>
              <button
                className={styles.order}
                type="submit"
                disabled={!enabled || bound}
              >
                Chargeable order
              </button>
            </p>

            <p className={styles.instruction}>Start the payment via Paypal:</p>
            {children}
          </section>
        </Fragment>
      )}

      {status === 'complete' && (
        <Fragment>
          <p className={styles.txComplete}>Order complete</p>

          <AccountAddress isOnChain />

          <DidLine did={did} />

          <Web3NameLine web3name={web3name} />

          {web3name && (
            <Fragment>
              <h2 className={styles.servicesHeading}>
                Congratulations! You can see your web3name in Sporran under
                “Manage web3name:{web3name}”
              </h2>

              <p className={styles.servicesSubline}>
                Now you can continue building and using your digital identity
                with KILT services:
              </p>
            </Fragment>
          )}

          {!web3name && (
            <h2 className={styles.servicesHeading}>
              Congratulations! Now you can start building and using your digital
              identity with KILT services:
            </h2>
          )}

          <ul className={styles.services}>
            {!web3name && (
              <li>
                Give your DID a custom name using{' '}
                <a
                  className={styles.serviceLink}
                  href="https://www.kilt.io/services/web3name"
                >
                  web3name
                </a>
              </li>
            )}
            <li>
              Add credentials such as social media accounts and your email
              address to your DID and web3name using{' '}
              <a
                className={styles.serviceLink}
                href="https://www.kilt.io/services/socialkyc"
              >
                SocialKYC
              </a>
            </li>
            <li>
              Sign digital files with your DID in a secure, decentralized way
              using{' '}
              <a
                className={styles.serviceLink}
                href="https://www.kilt.io/services/didsign"
              >
                DIDsign
              </a>
            </li>
            <li>
              <a
                className={styles.serviceLink}
                href="https://www.kilt.io/services/account-linking"
              >{`Link your ${web3name ? 'web3name' : 'DID'}`}</a>{' '}
              to your Polkadot ecosystem addresses (and soon, Ethereum)
            </li>
          </ul>
        </Fragment>
      )}

      {status === 'error' && (
        <Fragment>
          <p className={styles.txError}>Error</p>
          {flowError === 'paypal' && (
            <Fragment>
              <p>
                Something went wrong during your PayPal payment. Your account
                was not debited.
              </p>
              <p>Please restart the payment process.</p>
            </Fragment>
          )}

          {flowError === 'txd' && (
            <Fragment>
              <p>
                Something went wrong during the blockchain transaction. Your
                account was not debited.
              </p>
              <p>Please restart the payment process.</p>
            </Fragment>
          )}

          {flowError === 'unknown' && (
            <Fragment>
              <p>Some unexpected error happened.</p>
              <p>
                It’s possible that the transaction was still successful. Please
                wait a moment before checking your Sporran wallet and PayPal
                balance. After you have confirmed that your account does not
                have a {web3name ? 'web3name' : 'DID'} and your payment method
                was not charged, please check your internet connection and try
                again.
              </p>
            </Fragment>
          )}

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
