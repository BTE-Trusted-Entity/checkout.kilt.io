import * as styles from './CoverWeb3Name.module.css';

export function CoverWeb3Name() {
  return (
    <div className={styles.cover}>
      <h1 className={styles.heading}>Claim your web3name</h1>
      <p className={styles.subline}>
        Pay with KILT or Use Checkout Service / PayPal
      </p>

      <section className={styles.infoContainer}>
        <h3 className={styles.infoHeading}>Services - Build your Identity</h3>
        <p className={styles.infoTagline}>Claim a name as unique as you</p>

        <p className={styles.info}>
          With KILT you can build your identity in a secure way. Once you{' '}
          <a
            href="https://kilt-protocol.org/get-did/index.html"
            target="_blank"
            rel="noreferrer"
          >
            get your DID
          </a>
          , you can customize it with a unique easily-readable web3name.
        </p>

        <p className={styles.info}>
          You can then link this name with your{' '}
          <a
            href="https://www.kilt.io/services/socialkyc"
            target="_blank"
            rel="noreferrer"
          >
            SocialKYC credentials
          </a>{' '}
          and use it to sign with{' '}
          <a
            href="https://www.kilt.io/services/didsign"
            target="_blank"
            rel="noreferrer"
          >
            DIDsign
          </a>
          , adding extra layers of verification and trust.
        </p>

        <p className={styles.info}>
          You can also{' '}
          <a
            href="https://linking.trusted-entity.io/"
            target="_blank"
            rel="noreferrer"
          >
            link your web3name with addresses
          </a>{' '}
          across multiple blockchain ecosystems.
        </p>
      </section>
    </div>
  );
}
