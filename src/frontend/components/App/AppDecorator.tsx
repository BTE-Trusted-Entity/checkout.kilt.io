import { Fragment } from 'react';

import * as styles from './App.module.css';

// Storybook treats all CSS as CSS Modules, can’t use plain strings here
import * as globalStyles from '../../styles.css';

export function AppDecorator(Story: () => JSX.Element) {
  return (
    <Fragment>
      <header className={globalStyles.header}>
        <h2 className={globalStyles.title}>Checkout Service</h2>
        <nav className={globalStyles.navLine}>
          back to{' '}
          <a className={globalStyles.kiltLink} href="https://www.kilt.io/">
            kilt.io
          </a>
        </nav>
      </header>

      <main>
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
              unique digital fingerprint that is the core of your identity.
            </p>
          </section>
        </div>

        <Story />
      </main>

      <footer className={globalStyles.footer}>
        {/* TODO: add links */}
        <nav className={globalStyles.navMenu}>
          <h2 className={globalStyles.heading}>Checkout Service:</h2>
          <a href="#" className={globalStyles.navLink}>
            Imprint
          </a>
          <a href="#" className={globalStyles.navLink}>
            Terms and Conditions
          </a>
          <a href="#" className={globalStyles.navLink}>
            Privacy Policy
          </a>

          <a
            href="https://support.kilt.io/"
            className={`${globalStyles.support} ${globalStyles.navLink}`}
          >
            Support
          </a>
        </nav>

        <p className={globalStyles.copyright}>
          © 2022 B.T.E. BOTLabs Trusted Entity GmbH
        </p>
      </footer>
    </Fragment>
  );
}
