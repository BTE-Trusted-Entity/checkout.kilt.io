import * as styles from './App.module.css';

import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { Transaction } from '../Transaction/Transaction';
import { CoverDid } from '../CoverDid/CoverDid';
import { CoverWeb3Name } from '../CoverWeb3Name/CoverWeb3Name';
import { useTxParams } from '../../utilities/TxContext/TxContext';

export function App() {
  const { web3name } = useTxParams();

  const Cover = web3name ? CoverWeb3Name : CoverDid;

  return (
    <div className={styles.container}>
      <Header />

      <main className={styles.main}>
        <Cover />
        <Transaction />
      </main>

      <Footer />

      <cite className={styles.photoCitation}>
        {web3name
          ? 'Photo by Julentto Photography on Unsplash'
          : 'Photo by Clayton Cardinalli on Unsplash'}
      </cite>
    </div>
  );
}
