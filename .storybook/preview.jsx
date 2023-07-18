import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { init } from '@kiltprotocol/sdk-js';

import { TxProviderMock } from '../src/frontend/utilities/TxContext/TxProvider.mock';
import { configurationMock, ConfigurationContext } from '../src/frontend/utilities/ConfigurationContext/ConfigurationContext.ts';
import { AppDecorator } from '../src/frontend/components/App/AppDecorator';

import '../src/frontend/styles.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const paypal = {
  clientId:
    'ASpR3O7gBYzlOSnwK2hnuSslMAoMwdWIUSnLZaM9O1zMaa4e7uPSDZCwyp7_nzvLO_qZOmQtVrNUmzrJ',
  currency: 'EUR',
  intent: 'authorize',
};

init();

export const decorators = [
  AppDecorator,
  (Story) => (
    <TxProviderMock>
      <PayPalScriptProvider options={paypal}>
        <ConfigurationContext.Provider value={configurationMock}>
          <Story />
        </ConfigurationContext.Provider>
      </PayPalScriptProvider>
    </TxProviderMock>
  ),
];

export const parameters = {
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      desktop: {
        name: 'Desktop',
        type: 'desktop',
        styles: {
          height: '850px',
          width: '1440px',
        },
      },
    },
    defaultViewport: 'desktop',
  },
  layout: 'fullscreen',
};
