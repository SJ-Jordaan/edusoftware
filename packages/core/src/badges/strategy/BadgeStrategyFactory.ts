import { BadgeStrategy } from '../BadgeStrategy';
import { FirstTimeLoginStrategy } from './FirstTimeLoginStrategy';
import { PracticeLevelsStrategy } from './PracticeLevelsStrategy';

export class StrategyFactory {
  private static strategies: BadgeStrategy[] = [
    new PracticeLevelsStrategy(),
    new FirstTimeLoginStrategy(),
  ];

  static getStrategy(metric: string): BadgeStrategy | undefined {
    return this.strategies.find((strategy) => strategy.metric === metric);
  }
}
