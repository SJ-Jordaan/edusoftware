import { ApplicationError } from '@edusoftware/core/types';
import { IProgressDocumentPopulated } from '@edusoftware/core/databases';

const tenMinutesInMilliseconds = 1000 * 60 * 10;

/**
 * Checks if the current time has exceeded a specified time limit from a starting point.
 * @param {Date} startedAt - The starting time as a Date object.
 * @param {number} [limit=600000] - The time limit in milliseconds (default is 10 minutes).
 * @returns {boolean} True if the current time has exceeded the time limit from the startedAt time; false otherwise.
 * @throws {Error} If the startedAt parameter is not a valid Date object.
 */
export const hasExceededTimeLimit = (
  startedAt: Date,
  limit: number = tenMinutesInMilliseconds,
): boolean => {
  if (!(startedAt instanceof Date) || isNaN(startedAt.getTime())) {
    throw new Error('Invalid startedAt: Must be a valid Date object');
  }

  const now = new Date();
  return now.getTime() - startedAt.getTime() > limit;
};

/**
 * Calculates the time spent in seconds since the last correct answer or since the start if no correct answers.
 * @param progress - The progress object containing information about the user's attempts and timings.
 * @returns The time spent in seconds.
 */
export const calculateTimeSpent = (
  progress: IProgressDocumentPopulated,
): number => {
  const now = new Date();

  if (!progress.startedAt) {
    throw new ApplicationError('Invalid progress: Missing startedAt', 500);
  }

  let lastCorrectAnswerTimestamp = progress.startedAt;

  const lastCorrectQuestion = progress.questionsAttempted
    .filter((q) => q.correct)
    .sort((a, b) => {
      if (a.updatedAt && b.updatedAt) {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      }

      return 0;
    })[0];

  if (lastCorrectQuestion) {
    lastCorrectAnswerTimestamp = progress.updatedAt as Date;
  }

  return Math.round(
    (now.getTime() - lastCorrectAnswerTimestamp.getTime()) / 1000,
  );
};
