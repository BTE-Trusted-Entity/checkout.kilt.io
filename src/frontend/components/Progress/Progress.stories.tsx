import { Meta } from '@storybook/react';

import { Progress } from './Progress';

export default {
  title: 'Components/Progress',
  component: Progress,
} as Meta;

export function Template(): JSX.Element {
  return (
    <Progress stages={['Prepare', 'Order', 'Pay', 'Success']} current="Order" />
  );
}
