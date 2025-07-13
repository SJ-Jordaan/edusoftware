import { Api, StackContext, use } from 'sst/constructs';
import { StorageStack } from './StorageStack';
import { SecretStack } from './SecretStack';

export function ApiStack({ stack, app }: StackContext) {
  const { userTable } = use(StorageStack);
  const { MONGO_URI } = use(SecretStack);

  const logicTutorRoutes = {
    'POST /logictutor/level':
      'packages/functions/src/logictutor/level/create/index.main',
    'PUT /logictutor/level':
      'packages/functions/src/logictutor/level/update/index.main',
    'GET /logictutor/level/{test}':
      'packages/functions/src/logictutor/level/get/index.main',
    'GET /logictutor/level-previews':
      'packages/functions/src/logictutor/level/getAll/index.main',
    'DELETE /logictutor/level':
      'packages/functions/src/logictutor/level/delete/index.main',
  };

  const api = new Api(stack, 'Api', {
    customDomain: app.stage === 'prod' ? 'api.edusoftware.net' : undefined,
    defaults: {
      function: {
        bind: [MONGO_URI, userTable],
      },
    },
    routes: {
      'Get /session': 'packages/functions/src/auth/session.handler', // TODO: Fix up the path here, maybe create authApi
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
      'GET /scores': 'packages/functions/src/score/getLeaderboard/index.main',
      'POST /progress/{levelId}/{questionId}':
        'packages/functions/src/progress/submitAnswer/index.main',
      'GET /progress/{id}':
        'packages/functions/src/progress/getUserProgress/index.main',
      'GET /progress':
        'packages/functions/src/progress/getUserProgress/index.main',
      'POST /progress/{id}':
        'packages/functions/src/progress/startLevel/index.main',
      'GET /progress/level/{id}':
        'packages/functions/src/progress/getLevelProgress/index.main',
      'GET /report/dashboard':
        'packages/functions/src/reports/dashboard/index.main',
      'POST /badges/check': 'packages/functions/src/badges/check/index.main',
      'GET /badges': 'packages/functions/src/badges/get/index.main',
      ...logicTutorRoutes,
    },
  });

  stack.addOutputs({
    url: api.customDomainUrl ?? api.url,
  });

  return {
    api,
  };
}
