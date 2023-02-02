import { describe, it, jest, beforeEach } from '@jest/globals';

import {
  mockDialogAPI,
  mockScrollIntoView,
  render,
} from '../../../testing/testing';
import { TxProviderMock } from '../../utilities/TxContext/TxProvider.mock';

import { TransactionTemplate } from './TransactionTemplate';

const localeCost = 'EUR 4.00';

const actions = {
  handleTermsClick: jest.fn(),
  handleBindClick: jest.fn(),
  handleRestart: jest.fn(),
};

const web3NameParameters = {
  tx: '0xCAFE',
  web3name: 'artemis',
  did: 'did:kilt:4rMVzpAj8m5Fj9aGcRSTg2uFqZTVUxJF5UVKueVyi8C5GAZC',
};

function MockPayPalButton() {
  return <button>PayPal</button>;
}

describe('TransactionTemplate', () => {
  beforeEach(() => {
    mockDialogAPI();
    mockScrollIntoView();
  });

  it('should match snapshot with status=prepared', () => {
    const { container } = render(
      <TransactionTemplate
        status="prepared"
        enabled={false}
        bound={false}
        cost={localeCost}
        {...actions}
      >
        <MockPayPalButton />
      </TransactionTemplate>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with status=prepared for web3name', () => {
    const { container } = render(
      <TxProviderMock value={web3NameParameters}>
        <TransactionTemplate
          status="prepared"
          enabled={false}
          bound={false}
          cost={localeCost}
          {...actions}
        >
          <MockPayPalButton />
        </TransactionTemplate>
      </TxProviderMock>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with terms accepted', () => {
    const { container } = render(
      <TransactionTemplate
        status="prepared"
        enabled={true}
        bound={false}
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
        bound={true}
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
        bound={true}
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
        bound={true}
        cost={localeCost}
        {...actions}
      >
        <MockPayPalButton />
      </TransactionTemplate>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with status=complete for web3name', () => {
    const { container } = render(
      <TxProviderMock value={web3NameParameters}>
        <TransactionTemplate
          status="complete"
          enabled={true}
          bound={true}
          cost={localeCost}
          {...actions}
        >
          <MockPayPalButton />
        </TransactionTemplate>
      </TxProviderMock>,
    );

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot with flowError=paypal', () => {
    const { container } = render(
      <TransactionTemplate
        status="error"
        flowError="paypal"
        enabled={true}
        bound={true}
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
        bound={true}
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
        bound={true}
        cost={localeCost}
        {...actions}
      >
        <MockPayPalButton />
      </TransactionTemplate>,
    );

    expect(container).toMatchSnapshot();
  });
});
