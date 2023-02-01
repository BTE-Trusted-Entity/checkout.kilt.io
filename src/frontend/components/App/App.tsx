import * as styles from './App.module.css';

import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Transaction } from '../Transaction/Transaction';
import { CoverDid } from '../CoverDid/CoverDid';
import { useTxParams } from '../../utilities/TxContext/TxContext';

export function App(): JSX.Element {
  const { web3name } = useTxParams();

  // TODO:
  const Cover = web3name ? CoverDid : CoverDid;

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <Cover />
        <Transaction />
      </main>

      <Footer />

      <cite className={styles.photoCitation}>
        {/*TODO:*/}
        {web3name
          ? 'Photo by Clayton Cardinalli on Unsplash'
          : 'Photo by Clayton Cardinalli on Unsplash'}
      </cite>
    </div>
  );
}
