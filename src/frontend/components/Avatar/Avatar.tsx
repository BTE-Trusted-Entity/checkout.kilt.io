import * as styles from './Avatar.module.css';

import { useConfiguration } from '../../utilities/ConfigurationContext/ConfigurationContext';

interface Props {
  isOnChain: boolean;
}

export function Avatar({ isOnChain }: Props): JSX.Element {
  const circles = useConfiguration().polkadotIconCircles || [];

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
