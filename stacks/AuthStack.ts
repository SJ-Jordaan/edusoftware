import { Auth, StackContext, use } from 'sst/constructs';
import { ApiStack } from './ApiStack';
import { FrontendStack } from './FrontendStack';
import { SecretStack } from './SecretStack';

export function AuthStack({ stack }: StackContext) {
  const { api } = use(ApiStack);
  const { AutomaTutor, LogicTutor } = use(FrontendStack);
  const { GOOGLE_CLIENT_ID, LOGIC_GOOGLE_CLIENT_ID } = use(SecretStack);

  const auth = new Auth(stack, 'auth', {
    authenticator: {
      handler: 'packages/functions/src/auth/googleAuth.handler',
      bind: [
        AutomaTutor,
        LogicTutor,
        GOOGLE_CLIENT_ID,
        LOGIC_GOOGLE_CLIENT_ID,
        api,
      ],
    },
  });

  auth.attach(stack, {
    api,
    prefix: '/auth',
  });

  return {
    GOOGLE_CLIENT_ID,
    LOGIC_GOOGLE_CLIENT_ID,
  };
}
