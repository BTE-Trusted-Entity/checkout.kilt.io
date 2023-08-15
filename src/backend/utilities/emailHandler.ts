import { cwd } from 'node:process';
import path from 'node:path';

import * as aws from '@aws-sdk/client-ses';
import { createTransport } from 'nodemailer';

/* eslint-disable import/no-unresolved */
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import LegalPdf from 'url:../resources/Terms_and_Conditions_Checkout_Service.pdf';
/* eslint-enable import/no-unresolved */

import { getCostAsLocaleString } from '../../frontend/utilities/getCostAsLocaleString/getCostAsLocaleString';

import { configuration } from './configuration';
import { AcceptedTx } from './isAcceptedTx';

const ses = new aws.SESClient(configuration.aws);
const mailer = createTransport({ SES: { ses, aws } });

const from = 'KILT Checkout <checkout@kilt.io>';

const txText: Record<
  AcceptedTx,
  { label: string; purchase: string; cost: string }
> = {
  'did.create': {
    label: 'KILT DID',
    purchase: 'DID',
    cost: getCostAsLocaleString(configuration.didCost),
  },
  'web3Names.claim': {
    label: 'web3name on KILT',
    purchase: 'web3name',
    cost: getCostAsLocaleString(configuration.w3nCost),
  },
};

export async function sendConfirmationEmail(
  to: string,
  name: string,
  txType: 'did.create' | 'web3Names.claim',
) {
  const { label, purchase, cost } = txText[txType];

  const subject = `Thanks for using the Checkout Service to get your ${label}`;
  const text = `Dear ${name},

Thank you for using the Checkout Service for anchoring your ${purchase} on the
KILT blockchain for which we charged you ${cost} (including VAT)
through PayPal. Attached Terms and Conditions are applicable for your
order.

Best regards,

The B.T.E. team

B.T.E. BOTLabs Trusted Entity GmbH
Keithstraße 2-4
10787 Berlin, Germany
German Commercial Court:
Amtsgericht Charlottenburg in Berlin
Registration Number: HRB 231219B

VAT No: DE 346528612
Managing Director: Ingo Rübe
Contact: info@botlabs.org
Or go to Tech support and click on "Contact Us"
Requirements according to § 5 TMG (Germany)`;

  await mailer.sendMail({
    from,
    to,
    subject,
    text,
    attachments: [
      {
        path: path.join(cwd(), 'dist', 'backend', LegalPdf.replace(/\?.*/, '')),
      },
    ],
  });
}
