import * as styles from './Progress.module.css';

export function Progress({
  stages,
  current,
}: {
  stages: string[];
  current: string;
}) {
  const currentIndex = stages.indexOf(current);

  function getClass(index: number) {
    if (index < currentIndex) return styles.completed;
    if (index === currentIndex) return styles.current;
    return styles.step;
  }

  return (
    <ul className={styles.container}>
      {stages.map((stage, index) => (
        <li key={stage} className={getClass(index)}>
          {stage}
        </li>
      ))}
    </ul>
  );
}
