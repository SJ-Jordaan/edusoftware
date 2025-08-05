import { z } from 'zod';

export const LogictutorScoreSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  score: z.number(),
});

export const LogictutorLeaderboardSchema = z.object({
  levelId: z.string(),
  levelName: z.string(),
  description: z.string(),
  userScores: z.array(LogictutorScoreSchema).optional(),
});

export type LogictutorScore = z.infer<typeof LogictutorScoreSchema>;
export type LogictutorLeaderboard = z.infer<typeof LogictutorLeaderboardSchema>;
