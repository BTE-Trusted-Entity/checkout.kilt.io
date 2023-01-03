import { useEffect, useState } from 'react';
import ky from 'ky';

import { paths } from './paths';
import { Output } from './costs';

export function useCosts() {
  const [costs, setCosts] = useState<Output>();

  useEffect(() => {
    (async () => {
      setCosts(await ky.get(paths.costs).json<Output>());
    })();
  }, []);

  return costs;
}
