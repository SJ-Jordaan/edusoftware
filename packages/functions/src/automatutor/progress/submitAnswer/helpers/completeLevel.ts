import {
  IPopulatedLevelDoc,
  Score,
  IProgressDocumentPopulated,
} from '@edusoftware/core/databases';

/**
 * Marks a level as completed, updates the user's score for the level, or creates a new score record if it doesn't exist.
 * @param progress - The progress document for the level completion.
 * @param userId - The user's ID.
 * @param levelId - The ID of the level being completed.
 */
export const completeLevel = async (
  progress: IProgressDocumentPopulated,
  userId: string,
  levelId: string,
  isPractice: boolean | undefined,
): Promise<void> => {
  progress.completedAt = new Date();

  if (isPractice) {
    await progress.save();
    return;
  }

  try {
    let score = await Score.findOne({ userId, levelId });
    if (score) {
      score.score = progress.totalScore; // Update existing score
    } else {
      // Or create a new score record
      score = new Score({
        userId,
        levelId,
        score: progress.totalScore,
      });
    }

    await progress.save();
    await score.save();
  } catch (error) {
    // Proper error handling
    console.error('Failed to complete level:', error);
    throw new Error('Error completing level');
  }
};

/**
 * Checks if all questions in a level have been attempted correctly based on progress.
 * @param level - The level document with question IDs populated.
 * @param progress - The progress document detailing questions attempted.
 * @returns boolean indicating whether the level is completed (all questions attempted correctly).
 * @throws {Error} If an inconsistency in question IDs is detected.
 */
export const isLevelCompleted = (
  level: IPopulatedLevelDoc,
  progress: IProgressDocumentPopulated,
): boolean => {
  return level.questionIds.every((question) => {
    // Find the corresponding attempt for each question in the level
    const questionAttempt = progress.questionsAttempted.find(
      (attempt) =>
        attempt.questionId?._id.toString() === question._id.toString(),
    );

    // Check if there was an attempt and if it was correct
    return questionAttempt?.correct ?? false;
  });
};
