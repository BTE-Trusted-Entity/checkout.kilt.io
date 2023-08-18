import type { JSX } from 'react';

import * as styles from './App.module.css';

import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { CoverDid } from '../CoverDid/CoverDid';

export function AppDecorator(Story: () => JSX.Element) {
  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <CoverDid />
        <Story />
      </main>

      <Footer />
    </div>
  );
}
