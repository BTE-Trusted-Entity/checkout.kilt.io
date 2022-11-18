import { polkadotIcon } from '@polkadot/ui-shared';

import * as styles from './Avatar.module.css';

interface Props {
  address: string;
  isOnChain: boolean;
}

export function Avatar({ address, isOnChain }: Props): JSX.Element {
  const circles = polkadotIcon(address, { isAlternative: false });

  return (
    <div className={isOnChain ? styles.avatar : styles.pending}>
      <svg
        className={styles.identicon}
        height={64}
        width={64}
        viewBox="0 0 64 64"
      >
        {circles.map(({ cx, cy, fill, r }, key) => (
          <circle cx={cx} cy={cy} fill={fill} r={r} key={key} />
        ))}
      </svg>
    </div>
  );
}
