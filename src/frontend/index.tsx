import { createRoot } from 'react-dom/client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import ky from 'ky';

import { paths } from '../backend/endpoints/paths';

import { App } from './components/App/App';
import { TxProvider } from './utilities/TxContext/TxContext';

(async function renderApp() {
  const container = document.getElementById('app');
  if (!container) {
    return;
  }

  const paypal = {
    clientId: await ky.get(paths.paypalClientID).text(),
    currency: 'EUR',
    intent: 'authorize',
  };

  const root = createRoot(container);
  root.render(
    <TxProvider>
      <PayPalScriptProvider options={paypal}>
        <App />
      </PayPalScriptProvider>
    </TxProvider>,
  );
})();
