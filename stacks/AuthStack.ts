import { Auth, StackContext, use } from 'sst/constructs';
import { ApiStack } from './ApiStack';
import { FrontendStack } from './FrontendStack';
import { SecretStack } from './SecretStack';
import { LtlFrontendStack} from "./LtlFrontendStack";
import { LtlApiStack } from "./LtlApiStack";

export function AuthStack({ stack }: StackContext) {
  const { api } = use(ApiStack);
  const { api2} = use(LtlApiStack);
  const { AutomaTutor } = use(FrontendStack);
  const { LTLearn } = use(LtlFrontendStack);
  const { GOOGLE_CLIENT_ID } = use(SecretStack);

  const auth1 = new Auth(stack, 'auth1', {
    authenticator: {
      handler: 'packages/functions/src/automatutor/auth/googleAuth.handler',
      bind: [AutomaTutor, GOOGLE_CLIENT_ID, api],
    },
  });

  const auth2 = new Auth(stack, 'auth2', {
    authenticator: {
      handler: 'packages/functions/src/ltlearn/auth/googleAuth.handler',
      bind: [ LTLearn, GOOGLE_CLIENT_ID, api2],
    },
  });

  auth1.attach(stack, {
    api,
    prefix: '/auth',
  });

  auth2.attach(stack, {
    api: api2,
    prefix: '/auth2',
  });

  return {
    GOOGLE_CLIENT_ID,
  };
}
