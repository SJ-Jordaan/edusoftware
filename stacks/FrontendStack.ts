import { StackContext, StaticSite, use } from 'sst/constructs';
import { ApiStack } from './ApiStack';
import { StorageStack } from './StorageStack';

export function FrontendStack({ stack, app }: StackContext) {
  const { api } = use(ApiStack);
  const { competitionBucket } = use(StorageStack);

  // Define our React app
  const site = new StaticSite(stack, 'AutomaTutor', {
    customDomain:
      app.stage === 'prod'
        ? {
            domainName: 'edusoftware.net',
            domainAlias: 'www.edusoftware.net',
          }
        : undefined,
    path: 'packages/automatutor',
    buildCommand: 'pnpm run build',
    buildOutput: 'dist',
    // Pass in our environment variables
    environment: {
      VITE_API_URL: api.customDomainUrl ?? api.url,
      VITE_REGION: app.region,
      VITE_BUCKET: competitionBucket.bucketName,
      // VITE_USER_POOL_ID: auth.userPoolId,
      // VITE_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      // VITE_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
    },
  });

  // Show the url in the output
  stack.addOutputs({
    SiteUrl: site.customDomainUrl ?? site.url,
  });
}
