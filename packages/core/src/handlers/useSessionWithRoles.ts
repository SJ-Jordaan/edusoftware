import { useSession } from 'sst/node/auth';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Table } from 'sst/node/table';
import {
  UnauthorizedError,
  ForbiddenError,
  UserSession,
  NotFoundError,
} from '../types';

/**
 * Custom session hook that validates the user's authentication status and roles.
 * @param requiredRoles - An array of roles required to access the endpoint.
 * @returns The user session if the user is authenticated and authorized; otherwise, throws an error.
 */
export async function useSessionWithRoles(
  requiredRoles: string[] = [],
): Promise<UserSession & { userId: string }> {
  const session = useSession();

  if (session.type !== 'user') {
    throw new UnauthorizedError('Not authenticated');
  }

  const ddb = new DynamoDBClient({});
  const { Item } = await ddb.send(
    new GetItemCommand({
      TableName: Table.users.tableName,
      Key: marshall({ userId: session.properties.userID }),
    }),
  );

  if (!Item) {
    throw new NotFoundError('User not found in DynamoDB');
  }

  const user = unmarshall(Item) as UserSession;

  if (requiredRoles.length === 0) {
    return {
      ...user,
      userId: session.properties.userID,
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
    userId: session.properties.userID,
  };
}
