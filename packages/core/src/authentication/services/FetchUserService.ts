import { GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Table } from 'sst/node/table';
import { UserServiceStep } from '../UserServiceStep';
import { UserContext } from '../UserContext';
import { UserSession } from '../../types';

export class FetchUserService implements UserServiceStep {
  async handle(context: UserContext): Promise<void> {
    const userKey = marshall({ userId: context.userId });
    const existingUser = await context.ddb.send(
      new GetItemCommand({
        TableName: Table.users.tableName,
        Key: userKey,
      }),
    );

    if (existingUser.Item) {
      context.userData = unmarshall(existingUser.Item) as UserSession;
      context.isNewUser = false;
    }
  }
}
