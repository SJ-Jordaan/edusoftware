import { Config, StackContext } from 'sst/constructs';

export function SecretStack({ stack }: StackContext) {
  const MONGO_URI = new Config.Secret(stack, 'MONGO_URI');
  const GOOGLE_CLIENT_ID = new Config.Secret(stack, 'GOOGLE_CLIENT_ID');

  return {
    MONGO_URI,
    GOOGLE_CLIENT_ID,
  };
}
