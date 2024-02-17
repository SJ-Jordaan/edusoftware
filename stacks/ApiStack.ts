import { Api, Config, StackContext, use } from 'sst/constructs';
import { StorageStack } from './StorageStack';

export function ApiStack({ stack, app }: StackContext) {
  const MONGO_URI = new Config.Secret(stack, 'MONGO_URI');
  const { userTable } = use(StorageStack);

  const api = new Api(stack, 'Api', {
    customDomain: app.stage === 'prod' ? 'api.edusoftware.net' : undefined,
    defaults: {
      function: {
        bind: [MONGO_URI, userTable],
      },
    },
    routes: {
      'Get /session': 'packages/functions/src/auth/session.handler', // TODO: Fix up the path here, maybe create authApi
      'GET /': 'packages/functions/src/lambda.main',
      'GET /levels': 'packages/functions/src/levels/getLevels/index.main',
      'GET /levels/{id}': 'packages/functions/src/levels/getLevel/index.main',
      'POST /levels': 'packages/functions/src/levels/createLevel/index.main',
      'PUT /levels/{id}':
        'packages/functions/src/levels/updateLevel/index.main',
      'DELETE /levels/{id}':
        'packages/functions/src/levels/deleteLevel/index.main',
      'GET /questions/{id}':
        'packages/functions/src/questions/getQuestion/index.main',
      'POST /questions':
        'packages/functions/src/questions/createQuestion/index.main',
      'DELETE /questions/{id}':
        'packages/functions/src/questions/deleteQuestion/index.main',
      'PUT /questions/{id}':
        'packages/functions/src/questions/updateQuestion/index.main',
    },
  });

  stack.addOutputs({
    url: api.customDomainUrl ?? api.url,
  });

  return {
    api,
  };
}
