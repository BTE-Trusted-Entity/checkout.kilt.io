import type { Configuration } from '../../../backend/endpoints/home';

import { createContext, useContext } from 'react';

export const ConfigurationContext = createContext<Partial<Configuration>>({});

export function useConfiguration() {
  return useContext(ConfigurationContext);
}

export function loadConfiguration() {
  const element = document.querySelector('#configuration') as HTMLScriptElement;

  return JSON.parse(element.innerHTML) as Configuration;
}

export const configurationMock: Configuration = {
  costs: {
    did: '5',
    w3n: '4',
  },
  paypalClientID: 'paypalClientID',
};
