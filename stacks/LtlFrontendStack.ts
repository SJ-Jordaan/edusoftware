import { StackContext, StaticSite, use } from 'sst/constructs';
import { StorageStack } from './StorageStack';
import { LtlApiStack } from "./LtlApiStack";

export function LtlFrontendStack({ stack, app }: StackContext) {
  const { api2 } = use(LtlApiStack);
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
      VITE_LTL_API_URL: api2.customDomainUrl ?? api2.url,
      VITE_REGION: app.region,
      VITE_BUCKET: competitionBucket.bucketName,
      VITE_GOOGLE_CLIENT_ID:
        '620600408347-q5fbjttg0mnigus6gco78j9f4eavsica.apps.googleusercontent.com',
      VITE_GOOGLE_LOGIN_URI: `${api2.customDomainUrl ?? api2.url}/auth2/callback`,
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
