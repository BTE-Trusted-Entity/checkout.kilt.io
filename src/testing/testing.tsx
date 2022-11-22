// We do want to override the `render` from testing-library
// eslint-disable-next-line import/export
export * from '@testing-library/react';

import { jest } from '@jest/globals';
import { render as externalRender } from '@testing-library/react';

import { TxProviderMock } from '../frontend/utilities/TxContext/TxProvider.mock';

// We do want to override the `render` from testing-library
// eslint-disable-next-line import/export
export function render(
  ui: Parameters<typeof externalRender>[0],
  options?: Parameters<typeof externalRender>[1],
): ReturnType<typeof externalRender> {
  return externalRender(<TxProviderMock>{ui}</TxProviderMock>, options);
}

// https://github.com/jsdom/jsdom/issues/3294
export function mockDialogAPI(): void {
  HTMLDialogElement.prototype.showModal = jest.fn(function mock(
    this: HTMLDialogElement,
  ) {
    this.open = true;
  });
  HTMLDialogElement.prototype.close = jest.fn(function mock(
    this: HTMLDialogElement,
  ) {
    this.open = false;
  });
}
