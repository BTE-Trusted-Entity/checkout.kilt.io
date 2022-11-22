import { Meta } from '@storybook/react';

import { action } from '@storybook/addon-actions';

import { PayPalButtons } from '@paypal/react-paypal-js';

import { PurchaseUnit } from '@paypal/paypal-js';

import * as styles from './Transaction.module.css';

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
  handleRestart: action('restart'),
};

const mockPurchaseDetails: PurchaseUnit = {
  amount: { value: '4.00' },
  shipping: {
    type: 'SHIPPING',
    name: {
      full_name: 'Timothy Tumnus',
    },
    address: {
      address_line_1: '1 Lamppost Lane',
      address_line_2: 'Behind the Wardrobe',
      postal_code: '123456',
      admin_area_1: 'Narnia',
      country_code: 'GB',
    },
  },
};

const localeCost = 'EUR 4.00';

export default {
  title: 'Components/Transaction',
  component: TransactionTemplate,
} as Meta;

export function Prepared(): JSX.Element {
  return (
    <TransactionTemplate
      status="prepared"
      {...actions}
      cost={localeCost}
      enabled={false}
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
      purchaseDetails={mockPurchaseDetails}
    >
      <MockPaypalButton />
    </TransactionTemplate>
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
    >
      <MockPaypalButton />
    </TransactionTemplate>
  );
}
