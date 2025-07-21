import { Badges } from '../../components/Badges';
import { Challenges } from '../../components/Challenges';
import { Options } from '../../components/Options';

export const TABS = [
  {
    label: 'Challenges',
    content: <Challenges />,
  },
  {
    label: 'Badges',
    content: <Badges />,
  },
  {
    label: 'Options',
    content: <Options />,
  },
];
