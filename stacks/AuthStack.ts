import { Auth, Config, StackContext, use } from 'sst/constructs';
import { ApiStack } from './ApiStack';
import { FrontendStack } from './FrontendStack';

export function AuthStack({ stack }: StackContext) {
  const GOOGLE_CLIENT_ID = new Config.Secret(stack, 'GOOGLE_CLIENT_ID');
  const { api } = use(ApiStack);
  const { AutomaTutor } = use(FrontendStack);

  const auth = new Auth(stack, 'auth', {
    authenticator: {
      handler: 'packages/functions/src/auth/googleAuth.handler',
      bind: [AutomaTutor, GOOGLE_CLIENT_ID],
    },
  });

  auth.attach(stack, {
    api,
    prefix: '/auth',
  });
}
