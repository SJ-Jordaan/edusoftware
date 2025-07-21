import { Auth, StackContext, use } from 'sst/constructs';
import { ApiStack } from './ApiStack';
import { FrontendStack } from './FrontendStack';
import { SecretStack } from './SecretStack';
import { LtlFrontendStack} from "./LtlFrontendStack";

export function AuthStack({ stack }: StackContext) {
  const { api } = use(ApiStack);
  const { AutomaTutor } = use(FrontendStack);
  const { LTLearn } = use(LtlFrontendStack);
  const { GOOGLE_CLIENT_ID } = use(SecretStack);

  const auth = new Auth(stack, 'auth', {
    authenticator: {
      handler: 'packages/functions/src/auth/googleAuth.handler',
      bind: [AutomaTutor, LTLearn, GOOGLE_CLIENT_ID, api],
    },
  });

  auth.attach(stack, {
    api,
    prefix: '/auth',
  });

  return {
    GOOGLE_CLIENT_ID,
  };
}
