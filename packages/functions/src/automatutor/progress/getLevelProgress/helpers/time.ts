import { IProgressDocumentPopulated } from '@edusoftware/core/databases';
import { ApplicationError } from '@edusoftware/core/types';

/**
 * Calculates the time remaining in seconds for the level as a whole based on the total allocated time and progress.
 * @param progress - The progress object containing the start time of the level.
 * @param totalAllocatedTime - The total time allocated for the level in seconds.
 * @returns The time remaining in seconds.
 */
export const calculateTimeRemaining = (
  progress: IProgressDocumentPopulated,
  totalAllocatedTime: number,
): number => {
  const now = new Date();

  if (!progress.startedAt) {
    throw new ApplicationError('Invalid progress: Missing startedAt', 500);
  }

  const timeSpent = (now.getTime() - progress.startedAt.getTime()) / 1000;
  const timeRemaining = totalAllocatedTime - timeSpent;

  // Ensure that the time remaining does not go below 0
  return Math.max(0, Math.round(timeRemaining));
};
