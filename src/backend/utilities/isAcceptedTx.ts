const ACCEPTED_TRANSACTIONS = ['did.create', 'web3Names.claim'] as const;

export type AcceptedTx = (typeof ACCEPTED_TRANSACTIONS)[number];

export function isAcceptedTx(tx: string): tx is AcceptedTx {
  return ACCEPTED_TRANSACTIONS.includes(tx as AcceptedTx);
}
