import { useSession } from 'sst/node/auth';
import {
  UnauthorizedError,
  ForbiddenError,
  UserSession,
  OrganisationRole,
  OrganisationName,
} from '../types';

declare module 'sst/node/auth' {
  export interface SessionTypes {
    user: {
      userId: string;
      name: string;
      picture: string;
      email: string;
      roles: OrganisationRole[];
      organisations: OrganisationName[];
    };
  }
}
/**
 * Custom session hook that validates the user's authentication status and roles.
 * @param requiredRoles - An array of roles required to access the endpoint.
 * @returns The user session if the user is authenticated and authorized; otherwise, throws an error.
 */
export async function useSessionWithRoles(
  requiredRoles: OrganisationRole[] = [],
): Promise<UserSession> {
  const session = useSession();

  if (session.type !== 'user') {
    throw new UnauthorizedError('Not authenticated');
  }

  const user = session.properties as UserSession;

  if (requiredRoles.length === 0) {
    return {
      ...user,
      userId: session.properties.userId,
    };
  }

  const hasRequiredRole = requiredRoles.some((role) =>
    user.roles?.includes(role),
  );

  if (!hasRequiredRole) {
    throw new ForbiddenError('User does not have the required role');
  }

  return {
    ...user,
    userId: session.properties.userId,
  };
}
