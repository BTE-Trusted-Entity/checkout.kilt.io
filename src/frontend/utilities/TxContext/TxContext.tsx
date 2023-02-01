import { createContext, useContext } from 'react';

export interface TxContextType {
  tx: string;
  address?: string;
  did?: string;
  web3name?: string;
}

export const TxContext = createContext<TxContextType>({
  tx: '',
});

export function TxProvider({ children }: { children: JSX.Element }) {
  const params = new URLSearchParams(window.location.search);
  const tx = params.get('tx');
  const address = params.get('address') || undefined;
  const did = params.get('did') || undefined;
  const web3name = params.get('web3name') || undefined;

  if (!tx || !(address || (did && web3name))) {
    window.location.replace('https://www.kilt.io/');
    return null;
  }

  return (
    <TxContext.Provider value={{ tx, address, did, web3name }}>
      {children}
    </TxContext.Provider>
  );
}

export function useTxParams() {
  return useContext(TxContext);
}
