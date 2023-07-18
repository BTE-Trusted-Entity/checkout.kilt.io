export function checkTestEnvironment(isTestEnvironment: boolean) {
  if (!isTestEnvironment) {
    return;
  }

  const message =
    'This is a testing page, do not use it with real KILT coins. Do you want to go to the real Checkout Service?';

  if (!confirm(message)) {
    return;
  }

  location.href = `https://checkout.kilt.io${location.pathname}${location.search}`;
  throw new Error('The user does not want to use the testing page.');
}
