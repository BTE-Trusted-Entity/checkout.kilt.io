export function getCostAsLocaleString(cost: string, currencyDisplay = 'code') {
  return parseFloat(cost).toLocaleString(undefined, {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay,
  });
}
