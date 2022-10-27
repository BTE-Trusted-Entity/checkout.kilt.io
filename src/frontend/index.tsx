import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';

function renderApp() {
  const container = document.querySelector('.app');
  if (!container) {
    return;
  }

  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
}

renderApp();
