import { ConfigService } from '@kiltprotocol/config';

export async function getExtrinsicType(tx: string): Promise<string> {
  const api = ConfigService.get('api');

  const call = api.tx(api.createType('Call', tx));
  const { method, section } = api.registry.findMetaCall(call.callIndex);
  if (section === 'did' && method === 'submitDidCall') {
    const inner = api.createType(
      'DidDidDetailsDidAuthorizedCallOperation',
      call.args[0],
    );
    return `${inner.call.section}.${inner.call.method}`;
  }
  return `${section}.${method}`;
}
