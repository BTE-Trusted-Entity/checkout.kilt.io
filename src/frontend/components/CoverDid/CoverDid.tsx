import * as styles from './CoverDid.module.css';

export function CoverDid() {
  return (
    <div className={styles.cover}>
      <h1 className={styles.heading}>Get your DID</h1>
      <p className={styles.subline}>Pay with PayPal</p>

      <section className={styles.infoContainer}>
        <h3 className={styles.infoHeading}>Services - Build your Identity</h3>
        <p className={styles.infoTagline}>
          Your First Step to Creating a Digital Identity
        </p>

        <p className={styles.info}>
          With KILT you can build your identity in a secure way, keeping your
          data under your control.
        </p>
        <p className={styles.info}>
          Start by generating your DID (decentralized identifier), a string of
          numbers and letters that is your unique digital fingerprint and the
          core of your identity.
        </p>
        <p className={styles.info}>
          Once you have your DID, you can start building and using your digital
          identity with KILT services:
        </p>
        <ul className={styles.infoPoints}>
          <li className={styles.infoPoint}>
            Give your DID a custom name using web3name
          </li>
          <li className={styles.infoPoint}>
            Add credentials to your DID such as social media accounts, GitHub
            and email address using SocialKYC
          </li>
          <li className={styles.infoPoint}>
            Sign digital files with your DID in a secure, decentralized way
            using DIDsign.
          </li>
        </ul>
      </section>
    </div>
  );
}
