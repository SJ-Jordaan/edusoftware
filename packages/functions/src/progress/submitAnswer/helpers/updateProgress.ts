import { calculateTimeSpent } from './time';
import {
  IQuestionDoc,
  IProgressDocumentPopulated,
} from '@edusoftware/core/databases';

/**
 * Calculates the score based on time spent, correctness, and number of attempts.
 *
 * @param params - The parameters for score calculation.
 * @param params.timeSpent - The time spent in seconds.
 * @param params.isCorrect - Whether the answer is correct.
 * @param params.attempts - The number of attempts.
 * @returns The calculated score as a whole number.
 * @throws {Error} If any input parameter is invalid.
 */
function calculateScore({
  timeSpent, // in seconds
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

  // Initialize the score with a time-based bonus
  let score = 0;
  const initialTimeBonus = 500;
  const firstDecayRate = 8; // Points decreased per second for the first 30 seconds
  const secondDecayRate = 27; // Points decreased per second after 30 seconds

  // Calculate time bonus based on the time spent
  if (timeSpent <= 30) {
    score = initialTimeBonus - timeSpent * firstDecayRate;
  } else {
    // Calculate the remaining bonus after the first 30 seconds
    const bonusAfter30 = initialTimeBonus - 30 * firstDecayRate;
    // Calculate the decrease after 30 seconds
    const decreaseAfter30 = (timeSpent - 30) * secondDecayRate;
    score = Math.max(bonusAfter30 - decreaseAfter30, 0);
  }

  // Calculate the attempt bonus
  const attemptBonus = 444 - attempts * 111;
  score += attemptBonus;

  // Double the score if the answer was correct on the first attempt
  if (attempts === 1) {
    score *= 2;
  }

  // Ensure the score is rounded to a whole number
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
