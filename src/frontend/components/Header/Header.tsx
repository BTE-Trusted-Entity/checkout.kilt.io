import * as styles from './Header.module.css';

export function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Checkout Service</h1>
      <nav className={styles.navLine}>
        back to <a className={styles.kiltLink} href="https://www.kilt.io/" />
      </nav>
    </header>
  );
}
