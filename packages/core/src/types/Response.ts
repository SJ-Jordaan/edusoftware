export interface LambdaResponse<T> {
  statusCode: number;
  body: T;
  headers?: { [header: string]: string };
}

export interface AnswerEvaluation {
  isCorrect: boolean;
  nextQuestionId?: string;
  scoreEarned?: number;
  isCompleted: boolean;
  message: string;
}
