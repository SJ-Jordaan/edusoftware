import {
  IPopulatedLevelDoc,
  IProgressDocumentPopulated,
  Level,
  Progress,
} from '@edusoftware/core/databases';

export const fetchCurrentQuestionProgress = async (
  userId: string,
  levelId: string,
  questionId: string,
) => {
  if (!userId || !levelId || !questionId) {
    return null;
  }

  const levelDoc: IPopulatedLevelDoc | null =
    await Level.findById(levelId).populate('questionIds');

  if (!levelDoc || !levelDoc.questionIds) {
    return null;
  }

  const questionDoc = levelDoc.questionIds.find(
    (q) => q._id.toString() === questionId,
  );

  if (!questionDoc) {
    return null;
  }

  const levelProgress: IProgressDocumentPopulated | null =
    await Progress.findOne({
      userId,
      levelId,
    }).populate('questionsAttempted.questionId');

  if (!levelProgress) {
    return null;
  }

  const questionProgress = levelProgress.questionsAttempted.find(
    (q) => q.questionId?._id.toString() === questionId,
  );

  return {
    levelDoc,
    questionDoc,
    levelProgress,
    questionProgress,
  };
};

/**
 * Finds the next question in a level that hasn't been correctly attempted.
 * @param level - The level document with question IDs populated.
 * @param progress - The progress document detailing questions attempted.
 * @returns The ID of the next question to attempt, or undefined if all questions have been correctly attempted or if there are no questions.
 * @throws {Error} If question IDs are not properly populated or if there's an inconsistency in data.
 */
export const fetchNextQuestion = (
  level: IPopulatedLevelDoc,
  progress: IProgressDocumentPopulated,
): string => {
  const nextQuestion = level.questionIds.find(
    (question) =>
      !progress.questionsAttempted.some((attempt) => {
        // Ensure questionId is populated and not null before comparing
        if (!attempt.questionId) {
          throw new Error(
            'Question ID in progress is not populated or is null.',
          );
        }
        const attemptQuestionIdStr = attempt.questionId._id.toString();
        const questionIdStr = question._id.toString();
        return attemptQuestionIdStr === questionIdStr && attempt.correct;
      }),
  );

  return nextQuestion?.id;
};
