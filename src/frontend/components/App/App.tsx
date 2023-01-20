import * as styles from './App.module.css';

import { Transaction } from '../Transaction/Transaction';

export function App(): JSX.Element {
  return (
    <div className={styles.container}>
      <header className="header">
        <h2 className="title">Checkout Service</h2>
        <nav className="navLine">
          back to <a className="kiltLink" href="https://www.kilt.io/" />
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.cover}>
          <h1 className={styles.heading}>Get your DID</h1>
          <p className={styles.subline}>Pay with PayPal</p>

          <section className={styles.infoContainer}>
            <h3 className={styles.infoHeading}>
              Services - Build your Identity
            </h3>
            <p className={styles.infoTagline}>
              Your First Step to Creating a Digital Identity
            </p>

            <p className={styles.info}>
              With KILT you can build your identity in a secure way, keeping
              your data under your control.
            </p>
            <p className={styles.info}>
              Start by generating your DID (decentralized identifier), a unique
              digital fingerprint that is the core of your identity.
            </p>
          </section>
        </div>

        <Transaction />
      </main>

      <footer className="footer">
        {/* TODO: add links */}
        <nav className="navMenu">
          <h2 className="heading">Checkout Service:</h2>
          <a href="#" className="navLink">
            Imprint
          </a>
          <a href="#" className="navLink">
            Terms and Conditions
          </a>
          <a href="#" className="navLink">
            Privacy Policy
          </a>

          <a href="https://support.kilt.io/" className="navLink support">
            Support
          </a>
        </nav>

        <p className="copyright">© 2022 B.T.E. BOTLabs Trusted Entity GmbH</p>
      </footer>

      <cite className={styles.photoCitation}>
        Photo by Clayton Cardinalli on Unsplash
      </cite>
    </div>
  );
}
