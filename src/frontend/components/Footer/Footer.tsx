import * as styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.navMenu}>
        <h2 className={styles.heading}>Checkout Service:</h2>
        <a href="/imprint.html" className={styles.navLink}>
          Imprint
        </a>
        <a href="/terms.html" className={styles.navLink}>
          Terms and Conditions
        </a>
        <a href="/privacy.html" className={styles.navLink}>
          Privacy Policy
        </a>

        <a href="https://support.kilt.io/" className={styles.support}>
          Support
        </a>
      </nav>

      <p className={styles.copyright}>
        © 2023 B.T.E. BOTLabs Trusted Entity GmbH
      </p>
    </footer>
  );
}
