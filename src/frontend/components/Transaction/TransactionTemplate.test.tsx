import { describe, it, jest, beforeEach } from '@jest/globals';

import { mockDialogAPI, render } from '../../../testing/testing';

import { TransactionTemplate } from './TransactionTemplate';

const localeCost = 'EUR 4.00';

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
