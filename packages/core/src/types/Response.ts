export interface LambdaResponse<T> {
  statusCode: number;
  body: T;
  headers?: { [header: string]: string };
}
