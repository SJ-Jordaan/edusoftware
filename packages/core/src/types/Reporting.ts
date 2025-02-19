export interface DashboardReport {
  userCount: number;
  levelStats: EnhancedLevelStats[];
  lastUpdated: string;
}

export interface EnhancedLevelStats {
  levelId: string;
  levelName: string;
  averageScore: number;
  totalStudents: number;
  completionRate: number;
  inProgress: number;
  completed: number;
}
