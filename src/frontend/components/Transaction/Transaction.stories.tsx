import { Meta } from '@storybook/react';

import { action } from '@storybook/addon-actions';

import { PayPalButtons } from '@paypal/react-paypal-js';

import * as styles from './Transaction.module.css';

import { TxProviderMock } from '../../utilities/TxContext/TxProvider.mock';

import { TransactionTemplate } from './TransactionTemplate';

function MockPaypalButton() {
  return (
    <div className={styles.paypal}>
      <PayPalButtons fundingSource="paypal" disabled={false} />
    </div>
  );
}

function MockPaypalButtonDisabled() {
  return (
    <div className={styles.paypal}>
      <PayPalButtons fundingSource="paypal" disabled />
    </div>
  );
}

const actions = {
  handleTermsClick: action('terms'),
  handleBindClick: action('order'),
  handleRestart: action('restart'),
};

const localeCost = 'EUR 4.00';

export default {
  title: 'Components/Transaction',
  component: TransactionTemplate,
} as Meta;

const web3NameParameters = {
  tx: '0xCAFE',
  web3name: 'artemis',
  did: 'did:kilt:4rMVzpAj8m5Fj9aGcRSTg2uFqZTVUxJF5UVKueVyi8C5GAZC',
};

export function Web3Name(): JSX.Element {
  return (
    <TxProviderMock value={web3NameParameters}>
      <TransactionTemplate
        status="prepared"
        {...actions}
        cost="EUR 1.20"
        enabled={false}
        bound={false}
      >
        <MockPaypalButtonDisabled />
      </TransactionTemplate>
    </TxProviderMock>
  );
}

export function Prepared(): JSX.Element {
  return (
    <TransactionTemplate
      status="prepared"
      {...actions}
      cost={localeCost}
      enabled={false}
      bound={false}
    >
      <MockPaypalButtonDisabled />
    </TransactionTemplate>
  );
}

export function TermsAccepted(): JSX.Element {
  return (
    <TransactionTemplate
      status="prepared"
      {...actions}
      cost={localeCost}
      enabled={true}
      bound={false}
    >
      <MockPaypalButton />
    </TransactionTemplate>
  );
}

export function Bound(): JSX.Element {
  return (
    <TransactionTemplate
      status="prepared"
      {...actions}
      cost={localeCost}
      enabled={true}
      bound={true}
    >
      <MockPaypalButton />
    </TransactionTemplate>
  );
}

export function Authorizing(): JSX.Element {
  return (
    <TransactionTemplate
      status="authorizing"
      {...actions}
      cost={localeCost}
      enabled={true}
      bound={true}
    >
      <MockPaypalButton />
    </TransactionTemplate>
  );
}

export function Submitting(): JSX.Element {
  return (
    <TransactionTemplate
      status="submitting"
      {...actions}
      cost={localeCost}
      enabled={true}
      bound={true}
    >
      <MockPaypalButton />
    </TransactionTemplate>
  );
}

export function Complete(): JSX.Element {
  return (
    <TransactionTemplate
      status="complete"
      {...actions}
      cost={localeCost}
      enabled={true}
      bound={true}
    >
      <MockPaypalButton />
    </TransactionTemplate>
  );
}

export function CompleteWeb3Name(): JSX.Element {
  return (
    <TxProviderMock value={web3NameParameters}>
      <TransactionTemplate
        status="complete"
        {...actions}
        cost={localeCost}
        enabled={true}
        bound={true}
      >
        <MockPaypalButton />
      </TransactionTemplate>
    </TxProviderMock>
  );
}

export function PayPalError(): JSX.Element {
  return (
    <TransactionTemplate
      status="error"
      flowError="paypal"
      {...actions}
      cost={localeCost}
      enabled={true}
      bound={true}
    >
      <MockPaypalButton />
    </TransactionTemplate>
  );
}

export function TXDError(): JSX.Element {
  return (
    <TransactionTemplate
      status="error"
      flowError="txd"
      {...actions}
      cost={localeCost}
      enabled={true}
      bound={true}
    >
      <MockPaypalButton />
    </TransactionTemplate>
  );
}

export function UnknownError(): JSX.Element {
  return (
    <TransactionTemplate
      status="error"
      flowError="unknown"
      {...actions}
      cost={localeCost}
      enabled={true}
      bound={true}
    >
      <MockPaypalButton />
    </TransactionTemplate>
  );
}
