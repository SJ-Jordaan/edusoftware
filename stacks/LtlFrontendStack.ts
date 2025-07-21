import { StackContext, StaticSite, use } from 'sst/constructs';
import { ApiStack } from './ApiStack';
import { StorageStack } from './StorageStack';

export function LtlFrontendStack({ stack, app }: StackContext) {
  const { api } = use(ApiStack);
  const { competitionBucket } = use(StorageStack);  //TODO: Ask Steven if I should make a separate bucket for users

  // Define our React app
  const site = new StaticSite(stack, 'LTLearn', {
    customDomain:
      app.stage === 'prod'
        ? {
          domainName: 'ltlearn.net',
          domainAlias: 'www.ltlearn.net',
        }
        : undefined,
    path: 'packages/apps/ltlearn',
    buildCommand: 'pnpm run build',
    buildOutput: 'dist',
    // Pass in our environment variables
    environment: {
      VITE_API_URL: api.customDomainUrl ?? api.url,
      VITE_REGION: app.region,
      VITE_BUCKET: competitionBucket.bucketName,
      VITE_GOOGLE_CLIENT_ID:
        '620600408347-q5fbjttg0mnigus6gco78j9f4eavsica.apps.googleusercontent.com',
      VITE_GOOGLE_LOGIN_URI: `${api.customDomainUrl ?? api.url}/auth/callback`,
      // VITE_USER_POOL_ID: auth.userPoolId,
      // VITE_USER_POOL_CLIENT_ID: auth.userPoolClientId,
      // VITE_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId || "",
    },
  });

  // Show the url in the output
  stack.addOutputs({
    SiteUrl: site.customDomainUrl ?? site.url,
  });

  return {
    LTLearn: site,
  };
}
