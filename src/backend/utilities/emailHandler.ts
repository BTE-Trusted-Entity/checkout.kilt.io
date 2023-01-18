/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-unresolved */
import { cwd } from 'node:process';
import path from 'node:path';

import AWS from 'aws-sdk';
import { createTransport } from 'nodemailer';

// @ts-ignore
import LegalPdf from 'url:../resources/Terms_and_Conditions_Checkout_Service.pdf';

import { configuration } from './configuration';

const mailer = createTransport({
  SES: new AWS.SES(configuration.aws),
});

const from = 'KILT Checkout <checkout@kilt.io>';

export async function sendConfirmationEmail(to: string, name: string) {
  const { didCost } = configuration;
  const subject = 'Thanks for using the Checkout Service to get your KILT DID';
  const text = `Dear ${name},

Thank you for using the Checkout Service for anchoring your DID on the
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
