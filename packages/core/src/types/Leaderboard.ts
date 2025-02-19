export interface LeaderboardFilters {
  organizationId?: string;
  levelId?: string;
}

export interface LeaderboardEntry {
  userId: string;
  rank: number;
  totalScore: number;
  organizationId: string;
  userDetails: {
    name: string;
    email: string | null;
    picture: string | null;
  };
  scores: {
    levelId: string;
    levelName: string;
    score: number;
    achievedAt: string;
  }[];
}
export type LeaderboardResponse = LeaderboardEntry[];
