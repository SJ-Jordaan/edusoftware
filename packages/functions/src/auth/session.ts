import { ApiHandler } from 'sst/node/api';
import { useSessionWithRoles } from '@edusoftware/core/handlers';

// TODO: Add proper validation for the user session.
// Handle errors thrown by the useSessionWithRoles hook.
export const handler = ApiHandler(async () => {
  const user = await useSessionWithRoles();

  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
});
