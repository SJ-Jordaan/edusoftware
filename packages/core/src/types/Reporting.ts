export interface DashboardReport {
  userCount: number;
  averageScorePerLevel: Array<{ _id: string; averageScore: number }>;
  progressBreakdown: Array<{
    _id: string;
    started: number;
    completed: number;
  }>;
}
