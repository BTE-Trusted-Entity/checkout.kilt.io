import * as styles from './App.module.css';

import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Transaction } from '../Transaction/Transaction';

export function App(): JSX.Element {
  return (
    <div className={styles.container}>
      <Header />

      <cite className={styles.photoCitation}>
        Photo by Clayton Cardinalli on Unsplash
      </cite>

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

      <Footer />
    </div>
  );
}