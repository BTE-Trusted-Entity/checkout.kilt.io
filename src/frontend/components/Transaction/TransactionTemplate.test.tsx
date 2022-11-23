import { describe, it, jest, beforeEach } from '@jest/globals';
import { PurchaseUnit } from '@paypal/paypal-js';

import { mockDialogAPI, render } from '../../../testing/testing';

import { TransactionTemplate } from './TransactionTemplate';

const localeCost = 'EUR 4.00';

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

const actions = {
  handleTermsClick: jest.fn(),
  handleRestart: jest.fn(),
};

function MockPayPalButton() {
  return <button>PayPal</button>;
}

describe('TransactionTemplate', () => {
  beforeEach(mockDialogAPI);

  it('should match snapshot with status=prepared', () => {
    const { container } = render(
      <TransactionTemplate
        status="prepared"
        enabled={false}
        cost={localeCost}
        {...actions}
      >
        <MockPayPalButton />
      </TransactionTemplate>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with terms accepted', () => {
    const { container } = render(
      <TransactionTemplate
        status="prepared"
        enabled={true}
        cost={localeCost}
        {...actions}
      >
        <MockPayPalButton />
      </TransactionTemplate>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with status=authorizing', () => {
    const { container } = render(
      <TransactionTemplate
        status="authorizing"
        enabled={true}
        cost={localeCost}
        {...actions}
      >
        <MockPayPalButton />
      </TransactionTemplate>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with status=submitting', () => {
    const { container } = render(
      <TransactionTemplate
        status="submitting"
        enabled={true}
        cost={localeCost}
        {...actions}
      >
        <MockPayPalButton />
      </TransactionTemplate>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with status=complete', () => {
    const { container } = render(
      <TransactionTemplate
        status="complete"
        enabled={true}
        cost={localeCost}
        {...actions}
        purchaseDetails={mockPurchaseDetails}
      >
        <MockPayPalButton />
      </TransactionTemplate>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with flowError=paypal', () => {
    const { container } = render(
      <TransactionTemplate
        status="error"
        flowError="paypal"
        enabled={true}
        cost={localeCost}
        {...actions}
      >
        <MockPayPalButton />
      </TransactionTemplate>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with flowError=txd', () => {
    const { container } = render(
      <TransactionTemplate
        status="error"
        flowError="txd"
        enabled={true}
        cost={localeCost}
        {...actions}
      >
        <MockPayPalButton />
      </TransactionTemplate>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with flowError=unknown', () => {
    const { container } = render(
      <TransactionTemplate
        status="error"
        flowError="unknown"
        enabled={true}
        cost={localeCost}
        {...actions}
      >
        <MockPayPalButton />
      </TransactionTemplate>,
    );

    expect(container).toMatchSnapshot();
  });
});
