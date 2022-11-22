import { createContext } from 'react';

export const TxContext = createContext<{ address: string; tx: string }>({
  address: '',
  tx: '',
});

export function TxProvider({ children }: { children: JSX.Element }) {
  const params = new URLSearchParams(window.location.search);
  const address = params.get('address');
  const tx = params.get('tx');

  if (!address || !tx) {
    window.location.replace('https://www.kilt.io/');
    return null;
  }

  return (
    <TxContext.Provider value={{ address, tx }}>{children}</TxContext.Provider>
  );
}
