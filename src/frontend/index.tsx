import { createRoot } from 'react-dom/client';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

import {
  ConfigurationContext,
  loadConfiguration,
} from './utilities/ConfigurationContext/ConfigurationContext';
import { App } from './components/App/App';
import { TxProvider } from './utilities/TxContext/TxContext';

(async function renderApp() {
  const container = document.getElementById('app');
  if (!container) {
    return;
  }

  const frontendConfiguration = loadConfiguration();
  const paypal = {
    clientId: frontendConfiguration.paypalClientID,
    currency: 'EUR',
    intent: 'authorize',
  };

  const root = createRoot(container);
  root.render(
    <TxProvider>
      <PayPalScriptProvider options={paypal}>
        <ConfigurationContext.Provider value={frontendConfiguration}>
          <App />
        </ConfigurationContext.Provider>
      </PayPalScriptProvider>
    </TxProvider>,
  );
})();
