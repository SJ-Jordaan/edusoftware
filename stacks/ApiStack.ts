import { Api, Config, StackContext } from 'sst/constructs';

export function ApiStack({ stack, app }: StackContext) {
  const MONGO_URI = new Config.Secret(stack, 'MONGO_URI');

  const api = new Api(stack, 'Api', {
    customDomain: app.stage === 'prod' ? 'api.edusoftware.net' : undefined,
    defaults: {
      function: {
        bind: [MONGO_URI],
      },
    },
    routes: {
      'GET /': 'packages/functions/src/lambda.main',
      'GET /levels': 'packages/functions/src/levels/get.main',
    },
  });

  stack.addOutputs({
    url: api.customDomainUrl ?? api.url,
  });

  return {
    api,
  };
}
