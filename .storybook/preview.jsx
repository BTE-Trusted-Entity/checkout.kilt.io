import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import { withConsole, setConsoleOptions } from '@storybook/addon-console';
import { init } from '@kiltprotocol/sdk-js';

import { TxProviderMock } from '../src/frontend/utilities/TxContext/TxProvider.mock';
import { AppDecorator } from '../src/frontend/components/App/AppDecorator';

import '../src/frontend/styles.css';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const paypal = {
  'client-id':
    'ASpR3O7gBYzlOSnwK2hnuSslMAoMwdWIUSnLZaM9O1zMaa4e7uPSDZCwyp7_nzvLO_qZOmQtVrNUmzrJ',
  currency: 'EUR',
  intent: 'authorize',
};

init();
// You'll start to receive all console messages, warnings, errors in your action logger panel - Everything except HMR logs.
setConsoleOptions({
  panelExclude: [],
});

export const decorators = [
  // You'll receive console outputs as a console,
  // warn and error actions in the panel. You might want to know from
  // what stories they come. In this case, add withConsole decorator:
  (storyFn, context) => withConsole()(storyFn)(context),
  AppDecorator,
  (Story) => (
    <TxProviderMock>
      <PayPalScriptProvider options={paypal}>
        <Story />
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
