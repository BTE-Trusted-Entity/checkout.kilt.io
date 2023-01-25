import AWS from 'aws-sdk';
import nodemailer from 'nodemailer';

import { configuration } from './configuration';
const fromEmail = 'Checkout <checkout@kilt.io>';
const subjectBuyEmail =
  'Thanks for using the Checkout Service to get your KILT DID';

const contentBuyEmail = `Dear [name],

Thank you for using the Checkout Service for anchoring your DID on the 
KILT blockchain for which we charged you [didCost] Euro (including VAT) 
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

export async function sendBuyEmail(buyerEmail: string, buyerName: string) {
  const { aws, didCost } = configuration;
  const mailer = nodemailer.createTransport({
    SES: new AWS.SES(aws),
  });

  await mailer.sendMail({
    from: fromEmail,
    to: buyerEmail,
    subject: subjectBuyEmail,
    text: contentBuyEmail
      .replace('[name]', buyerName)
      .replace('[didCost]', didCost),
    attachments: [
      {
        filename: 'terms_and_conditions_checkout_service.pdf',
        contentType: 'application/pdf',
        path: 'https://kilt-protocol.org/files/Terms_and_Conditions_CheckoutService.pdf',
      },
    ],
  });
}
