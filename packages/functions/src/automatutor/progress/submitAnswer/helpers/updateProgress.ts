import { calculateTimeSpent } from './time';
import {
  IQuestionDoc,
  IProgressDocumentPopulated,
} from '@edusoftware/core/databases';

/**
 * Calculates the score based on time spent, correctness, and number of attempts.
 *
 * @param {number} timeSpent - The time spent in seconds.
 * @param {boolean} isCorrect - Whether the answer is correct.
 * @param {number} attempts - The number of attempts.
 * @returns {number} The calculated score as a whole number.
 * @throws {Error} If any input parameter is invalid.
 */
function calculateScore({
  timeSpent,
  isCorrect,
  attempts,
}: {
  timeSpent: number;
  isCorrect: boolean;
  attempts: number;
}): number {
  // Validate input parameters
  if (timeSpent < 0) throw new Error('timeSpent must be non-negative');
  if (typeof isCorrect !== 'boolean')
    throw new Error('isCorrect must be a boolean');
  if (attempts < 1) throw new Error('attempts must be at least 1');

  // Early exit if the answer is incorrect
  if (!isCorrect) {
    return 0;
  }

  const BASE_SCORE = 500; // Base score for the worst correct performance
  const MAX_TIME = 600; // Max considered time in seconds
  const TIME_BONUS_PER_SECOND = 1; // Bonus per second saved from MAX_TIME
  const MAX_ATTEMPT_BONUS = 1000; // Max bonus for attempts, achieved with 1 attempt
  const ATTEMPT_BONUS_DECAY = 100; // Reduction in attempt bonus per attempt beyond the first

  // Calculate time bonus
  const time_bonus = Math.max(MAX_TIME - timeSpent, 0) * TIME_BONUS_PER_SECOND;

  // Calculate attempts bonus, ensuring no bonus after 10 attempts
  const attempt_bonus = Math.max(
    MAX_ATTEMPT_BONUS - (attempts - 1) * ATTEMPT_BONUS_DECAY,
    0,
  );

  // Calculate total score
  const score = BASE_SCORE + time_bonus + attempt_bonus;

  return Math.round(score);
}

/**
 * Updates the progress of a user for a specific question and recalculates the total score.
 * @param progress - The current progress document for the user.
 * @param questionProgress - The progress for the specific question being updated.
 * @param evaluation - The result of evaluating the user's answer for the question.
 * @param question - The question for which progress is being updated.
 */
export const updateProgress = (
  progress: IProgressDocumentPopulated,
  questionProgress: IProgressDocumentPopulated['questionsAttempted'][0] | null,
  isAnswerCorrect: boolean,
  question: IQuestionDoc,
): void => {
  try {
    const timeSpent = calculateTimeSpent(progress);

    let usableQuestionProgress = questionProgress;
    if (!usableQuestionProgress) {
      usableQuestionProgress = {
        questionId: question._id,
        attempts: 1,
        correct: isAnswerCorrect,
        timeSpent: timeSpent,
        hintsUsed: 0,
        scoreEarned: 0,
      };

      usableQuestionProgress.scoreEarned = calculateScore({
        timeSpent: usableQuestionProgress.timeSpent,
        isCorrect: isAnswerCorrect,
        attempts: usableQuestionProgress.attempts,
      });

      progress.questionsAttempted.push(usableQuestionProgress);

      progress.totalScore += usableQuestionProgress.scoreEarned;

      return;
    }

    usableQuestionProgress.attempts += 1;
    usableQuestionProgress.correct = isAnswerCorrect;
    usableQuestionProgress.timeSpent += timeSpent;
    const previousScore = usableQuestionProgress.scoreEarned;
    usableQuestionProgress.scoreEarned = calculateScore({
      timeSpent: usableQuestionProgress.timeSpent,
      isCorrect: isAnswerCorrect,
      attempts: usableQuestionProgress.attempts,
    });

    // Update the total score by adding the difference between the new and previous scores
    progress.totalScore += usableQuestionProgress.scoreEarned - previousScore;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to update progress:', error);
      throw new Error(`Error updating progress: ${error.message}`);
    }

    console.error('Failed to update progress:', error);
    throw new Error(`Error updating progress: ${error}`);
  }
};
