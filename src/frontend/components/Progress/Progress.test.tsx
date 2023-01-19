import { describe, it } from '@jest/globals';

import { render } from '../../../testing/testing';

import { Progress } from './Progress';

describe('Progress', () => {
  it('should match the snapshot', async () => {
    const { container } = render(
      <Progress
        stages={['Prepare', 'Order', 'Pay', 'Success']}
        current="Order"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
