import { StackContext, StaticSite, use } from 'sst/constructs';
import { ApiStack } from './ApiStack';
import { StorageStack } from './StorageStack';

export function FrontendStack({ stack, app }: StackContext): {
  AutomaTutor: StaticSite;
  LogicTutor: StaticSite;
} {
  const { api } = use(ApiStack);
  const { competitionBucket } = use(StorageStack);

  // AutomaTutor app
  const automaTutor = new StaticSite(stack, 'AutomaTutor', {
    customDomain:
      app.stage === 'prod'
        ? {
            domainName: 'edusoftware.net',
            domainAlias: 'www.edusoftware.net',
          }
        : undefined,
    path: 'packages/apps/automatutor',
    buildCommand: 'pnpm run build',
    buildOutput: 'dist',
    environment: {
      VITE_API_URL: api.customDomainUrl ?? api.url,
      VITE_REGION: app.region,
      VITE_BUCKET: competitionBucket.bucketName,
      VITE_GOOGLE_CLIENT_ID:
        '399481916752-fb7fa2a0i9fs6vpj2ncu68a4q4jkaob8.apps.googleusercontent.com',
      VITE_GOOGLE_LOGIN_URI: `${api.customDomainUrl ?? api.url}/auth/callback`,
    },
  });

  // LogicTutor app
  const logicTutor = new StaticSite(stack, 'LogicTutor', {
    path: 'packages/apps/logictutor',
    buildCommand: 'pnpm run build',
    buildOutput: 'dist',
    environment: {
      VITE_API_URL: api.customDomainUrl ?? api.url,
      VITE_REGION: app.region,
      VITE_BUCKET: competitionBucket.bucketName,
      VITE_GOOGLE_CLIENT_ID:
        '399481916752-fb7fa2a0i9fs6vpj2ncu68a4q4jkaob8.apps.googleusercontent.com',
      VITE_GOOGLE_LOGIN_URI: `${api.customDomainUrl ?? api.url}/auth/callback`,
    },
  });

  // Outputs
  stack.addOutputs({
    AutomaTutorUrl: automaTutor.customDomainUrl ?? automaTutor.url,
    LogicTutorUrl: logicTutor.url,
  });

  return {
    AutomaTutor: automaTutor,
    LogicTutor: logicTutor,
  };
}
