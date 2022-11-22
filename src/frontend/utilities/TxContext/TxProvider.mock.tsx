import { TxContext } from './TxContext';

const txMock = {
  address: '4rjRmamwCipCeLpVGSrwtWoWCu53FXXf6S7f6DYJX6k644ML',
  tx: '0x400020e93a1c3c7e8cb627d200b0ffd64018e660ffcf1123cfa73b8a1b9644dfcd60e28e8737423874a3732fcd31bb59126ab74924463a9960383d6b3cc634f5a517040022915000bb08163e978e4766eb3c7d7aba8634241bc1a7f4f99ad02116cc9d1f000000018ebd06993f336f69468e07f1f6050bcd443831010f2ed51fa0ab494d0bd19a7dfe62372684491d7d6109ef1714e25e78c882e992fee4faec27cc6351c8179682',
};

export function TxProviderMock({
  tx = txMock,
  children,
}: {
  tx?: { address: string; tx: string };
  children: JSX.Element;
}) {
  return <TxContext.Provider value={tx}>{children}</TxContext.Provider>;
}
