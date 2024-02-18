import { ApiHandler } from 'sst/node/api';
import { useSessionWithRoles } from '@edusoftware/core/handlers';

export const handler = ApiHandler(async () => {
  const user = await useSessionWithRoles();

  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
});
