import { StackContext, StaticSite, use } from 'sst/constructs';
import { ApiStack } from './ApiStack';
import { StorageStack } from './StorageStack';

export function FrontendStack({ stack, app }: StackContext): {
  AutomaTutor: StaticSite;
  LogicTutor: StaticSite;
} {
  const { api } = use(ApiStack);
  const { competitionBucket } = use(StorageStack);

  // Derive domain base per stage
  const domainBase =
    app.stage === 'prod' ? 'edusoftware.net' : 'dev.edusoftware.net';

  // Helper to build custom domain config (allow future extension eg external domain flag)
  const tutorDomainName = `tutor.${domainBase}`; // tutor.edusoftware.net OR tutor.dev.edusoftware.net
  const logicDomainName = `logic.${domainBase}`; // logic.edusoftware.net OR logic.dev.edusoftware.net

  // AutomaTutor (Tutor) app
  const automaTutor = new StaticSite(stack, 'AutomaTutor', {
    customDomain:
      app.stage === 'prod'
        ? {
            domainName: tutorDomainName,
            // Keep www alias pointing to tutor (optional). If you also want apex, create Route53 A alias manually.
            domainAlias: 'www.edusoftware.net',
          }
        : {
            domainName: tutorDomainName,
            // Explicitly specify hosted zone for dev account subdomain delegation
            hostedZone: 'dev.edusoftware.net',
          },
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
      VITE_STAGE: app.stage,
    },
  });

  // LogicTutor app
  const logicTutor = new StaticSite(stack, 'LogicTutor', {
    customDomain:
      app.stage === 'prod'
        ? {
            domainName: logicDomainName,
          }
        : {
            domainName: logicDomainName,
            hostedZone: 'dev.edusoftware.net',
          },
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
      VITE_STAGE: app.stage,
    },
  });

  // Outputs
  stack.addOutputs({
    AutomaTutorUrl: automaTutor.customDomainUrl ?? automaTutor.url,
    LogicTutorUrl: logicTutor.customDomainUrl ?? logicTutor.url,
    Stage: app.stage,
  });

  return {
    AutomaTutor: automaTutor,
    LogicTutor: logicTutor,
  };
}
