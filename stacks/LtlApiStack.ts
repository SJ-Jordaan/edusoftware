import { Api, StackContext, use } from 'sst/constructs';
import { StorageStack } from './StorageStack';
import { SecretStack } from './SecretStack';

export function LtlApiStack({ stack, app }: StackContext) {
  const { userTable } = use(StorageStack);
  const { MONGO_URI } = use(SecretStack);

  const api2 = new Api(stack, 'Api-Ltl', {
    customDomain: app.stage === 'prod' ? 'api.ltlearn.net' : undefined, //TODO: Note change
    defaults: {
      function: {
        bind: [MONGO_URI, userTable],
      },
    },
    routes: {
      'Get /session': 'packages/functions/src/ltlearn/auth/session.handler', // TODO: Fix up the path here, maybe create authApi
      'GET /levels': 'packages/functions/src/ltlearn/levels/getLevels/index.main',
      'GET /levels/{id}': 'packages/functions/src/ltlearn/levels/getLevel/index.main',
      'POST /levels': 'packages/functions/src/ltlearn/levels/createLevel/index.main',
      'PUT /levels/{id}':
        'packages/functions/src/ltlearn/levels/updateLevel/index.main',
      'DELETE /levels/{id}':
        'packages/functions/src/ltlearn/levels/deleteLevel/index.main',
      'GET /questions/{id}':
        'packages/functions/src/ltlearn/questions/getQuestion/index.main',
      'POST /questions':
        'packages/functions/src/ltlearn/questions/createQuestion/index.main',
      'DELETE /questions/{id}':
        'packages/functions/src/ltlearn/questions/deleteQuestion/index.main',
      'PUT /questions/{id}':
        'packages/functions/src/ltlearn/questions/updateQuestion/index.main',
      'GET /scores': 'packages/functions/src/ltlearn/score/getLeaderboard/index.main',
      'POST /progress/{levelId}/{questionId}':
        'packages/functions/src/ltlearn/progress/submitAnswer/index.main',
      'GET /progress/{id}':
        'packages/functions/src/ltlearn/progress/getUserProgress/index.main',
      'GET /progress':
        'packages/functions/src/ltlearn/progress/getUserProgress/index.main',
      'POST /progress/{id}':
        'packages/functions/src/ltlearn/progress/startLevel/index.main',
      'GET /progress/level/{id}':
        'packages/functions/src/ltlearn/progress/getLevelProgress/index.main',
      'GET /report/dashboard':
        'packages/functions/src/ltlearn/reports/dashboard/index.main',
      'POST /badges/check': 'packages/functions/src/ltlearn/badges/check/index.main',
      'GET /badges': 'packages/functions/src/ltlearn/badges/get/index.main',
    },
  });

  stack.addOutputs({
    url: api2.customDomainUrl ?? api2.url,
  });

  return {
    api2,
  };
}
