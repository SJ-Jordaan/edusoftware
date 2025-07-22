import { Api, StackContext, use } from 'sst/constructs';
import { StorageStack } from './StorageStack';
import { SecretStack } from './SecretStack';

export function ApiStack({ stack, app }: StackContext) {
  const { userTable } = use(StorageStack);
  const { MONGO_URI } = use(SecretStack);

  const api = new Api(stack, 'Api', {
    customDomain: app.stage === 'prod' ? 'api.edusoftware.net' : undefined,
    defaults: {
      function: {
        bind: [MONGO_URI, userTable],
      },
    },
    routes: {
      'Get /session': 'packages/functions/src/automatutor/auth/session.handler', // TODO: Fix up the path here, maybe create authApi
      'GET /levels': 'packages/functions/src/automatutor/levels/getLevels/index.main',
      'GET /levels/{id}': 'packages/functions/src/automatutor/levels/getLevel/index.main',
      'POST /levels': 'packages/functions/src/automatutor/levels/createLevel/index.main',
      'PUT /levels/{id}':
        'packages/functions/src/automatutor/levels/updateLevel/index.main',
      'DELETE /levels/{id}':
        'packages/functions/src/automatutor/levels/deleteLevel/index.main',
      'GET /questions/{id}':
        'packages/functions/src/automatutor/questions/getQuestion/index.main',
      'POST /questions':
        'packages/functions/src/automatutor/questions/createQuestion/index.main',
      'DELETE /questions/{id}':
        'packages/functions/src/automatutor/questions/deleteQuestion/index.main',
      'PUT /questions/{id}':
        'packages/functions/src/automatutor/questions/updateQuestion/index.main',
      'GET /scores': 'packages/functions/src/automatutor/score/getLeaderboard/index.main',
      'POST /progress/{levelId}/{questionId}':
        'packages/functions/src/automatutor/progress/submitAnswer/index.main',
      'GET /progress/{id}':
        'packages/functions/src/automatutor/progress/getUserProgress/index.main',
      'GET /progress':
        'packages/functions/src/automatutor/progress/getUserProgress/index.main',
      'POST /progress/{id}':
        'packages/functions/src/automatutor/progress/startLevel/index.main',
      'GET /progress/level/{id}':
        'packages/functions/src/automatutor/progress/getLevelProgress/index.main',
      'GET /report/dashboard':
        'packages/functions/src/automatutor/reports/dashboard/index.main',
      'POST /badges/check': 'packages/functions/src/automatutor/badges/check/index.main',
      'GET /badges': 'packages/functions/src/automatutor/badges/get/index.main',
    },
  });

  stack.addOutputs({
    url: api.customDomainUrl ?? api.url,
  });

  return {
    api,
  };
}
