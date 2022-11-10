import { createRoot } from 'react-dom/client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import { App } from './components/App/App';
import { TxProvider } from './utilities/TxContext';

function renderApp() {
  const container = document.getElementById('app');
  if (!container) {
    return;
  }

  const paypal = {
    'client-id': process.env.CLIENT_ID_PAYPAL as string,
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
}

renderApp();
