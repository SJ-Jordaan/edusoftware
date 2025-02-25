export interface BadgeStrategy {
  metric: string;
  verify(userId: string): Promise<number>;
}
