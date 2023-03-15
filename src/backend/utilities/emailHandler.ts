import { cwd } from 'node:process';
import path from 'node:path';

import AWS from 'aws-sdk';
import { createTransport } from 'nodemailer';

/* eslint-disable import/no-unresolved */
/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
// @ts-ignore
import LegalPdf from 'url:../resources/Terms_and_Conditions_Checkout_Service.pdf';
/* eslint-enable import/no-unresolved */

import { configuration } from './configuration';

const txText: Record<
  'did.create' | 'web3Names.claim',
  { subject: string; body: string }
> = {
  'did.create': {
    subject: 'KILT DID',
    body: 'DID',
  },
  'web3Names.claim': {
    subject: 'web3name on KILT',
    body: 'web3name',
  },
};

const mailer = createTransport({
  SES: new AWS.SES(configuration.aws),
});

const from = 'KILT Checkout <checkout@kilt.io>';

export async function sendConfirmationEmail(
  to: string,
  name: string,
  txType: 'did.create' | 'web3Names.claim',
) {
  const { didCost } = configuration;
  const subject = `Thanks for using the Checkout Service to get your ${txText[txType].subject} `;
  const text = `Dear ${name},

Thank you for using the Checkout Service for anchoring your ${txText[txType].body} on the
KILT blockchain for which we charged you ${didCost} Euro (including VAT)
through PayPal. Attached Terms and Conditions are applicable for your
order.

Best regards,

The team of the B.T.E.

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
