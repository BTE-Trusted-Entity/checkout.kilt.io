import { Fragment } from 'react';

import * as styles from './App.module.css';

import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Transaction } from '../Transaction/Transaction';
import { useBooleanState } from '../../utilities/useBooleanState';

export function App(): JSX.Element {
  const showOverlay = useBooleanState();

  return (
    <Fragment>
      <div className={!showOverlay.current ? styles.container : styles.blurred}>
        <Header />

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
                Start by generating your DID (decentralized identifier), a
                unique digital fingerprint that is the core of your identity.
              </p>
            </section>
          </div>

          <Transaction showOverlay={showOverlay} />
        </main>

        <Footer />

        <cite className={styles.photoCitation}>
          Photo by Clayton Cardinalli on Unsplash
        </cite>
      </div>

      {showOverlay.current && (
        <div className={styles.overlay}>
          <p>Please wait while your transaction is being processed</p>
        </div>
      )}
    </Fragment>
  );
}
