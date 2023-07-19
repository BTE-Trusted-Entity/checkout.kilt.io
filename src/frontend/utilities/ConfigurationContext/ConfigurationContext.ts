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
  isTestEnvironment: false,
  polkadotIconCircles: [
    { cx: 32, cy: 32, fill: '#eee', r: 32 },
    { cx: 32, cy: 8, fill: 'hsl(50, 56%, 75%)', r: 5 },
    { cx: 32, cy: 20, fill: 'hsl(118, 56%, 53%)', r: 5 },
    { cx: 21.607695154586736, cy: 14, fill: 'hsl(61, 56%, 75%)', r: 5 },
    { cx: 11.215390309173472, cy: 20, fill: 'hsl(174, 56%, 35%)', r: 5 },
    { cx: 21.607695154586736, cy: 26, fill: 'hsl(39, 56%, 35%)', r: 5 },
    { cx: 11.215390309173472, cy: 32, fill: 'hsl(61, 56%, 75%)', r: 5 },
    { cx: 11.215390309173472, cy: 44, fill: 'hsl(50, 56%, 75%)', r: 5 },
    { cx: 21.607695154586736, cy: 38, fill: 'hsl(118, 56%, 53%)', r: 5 },
    { cx: 21.607695154586736, cy: 50, fill: 'hsl(315, 56%, 75%)', r: 5 },
    { cx: 32, cy: 56, fill: 'hsl(33, 56%, 35%)', r: 5 },
    { cx: 32, cy: 44, fill: 'hsl(298, 56%, 15%)', r: 5 },
    { cx: 42.392304845413264, cy: 50, fill: 'hsl(185, 56%, 35%)', r: 5 },
    { cx: 52.78460969082653, cy: 44, fill: 'hsl(236, 56%, 35%)', r: 5 },
    { cx: 42.392304845413264, cy: 38, fill: 'hsl(202, 56%, 75%)', r: 5 },
    { cx: 52.78460969082653, cy: 32, fill: 'hsl(185, 56%, 35%)', r: 5 },
    { cx: 52.78460969082653, cy: 20, fill: 'hsl(33, 56%, 35%)', r: 5 },
    { cx: 42.392304845413264, cy: 26, fill: 'hsl(298, 56%, 15%)', r: 5 },
    { cx: 42.392304845413264, cy: 14, fill: 'hsl(315, 56%, 75%)', r: 5 },
    { cx: 32, cy: 32, fill: 'hsl(90, 56%, 35%)', r: 5 },
  ],
};
