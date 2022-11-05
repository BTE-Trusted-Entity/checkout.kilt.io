import * as styles from './Footer.module.css';

export function Footer(): JSX.Element {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <h2 className={styles.heading}>Checkout Service:</h2>
        {/* TODO: add links */}
        <nav className={styles.navMenu}>
          <a href="#" className={styles.navLink}>
            Imprint
          </a>
          <a href="#" className={styles.navLink}>
            Terms and Conditions
          </a>
          <a href="#" className={styles.navLink}>
            Privacy Policy
          </a>

          <a href="#" className={styles.support}>
            Support
          </a>
        </nav>

        <p className={styles.copyright}>
          © 2022 B.T.E. BOTLabs Trusted Entity GmbH
        </p>
      </div>
    </footer>
  );
}
