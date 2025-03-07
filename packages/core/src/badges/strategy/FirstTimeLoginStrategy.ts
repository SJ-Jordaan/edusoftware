import { BadgeStrategy } from '../BadgeStrategy';

export class FirstTimeLoginStrategy implements BadgeStrategy {
  metric = 'loginCount';

  async verify(): Promise<number> {
    return 1;
  }
}
