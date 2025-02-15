import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Table } from 'sst/node/table';
import { UserServiceStep } from '../UserServiceStep';
import { UserContext } from '../UserContext';

export class UpdateUserService implements UserServiceStep {
  async handle(context: UserContext): Promise<void> {
    const { claims, userData, ddb, isNewUser } = context;

    const infoHasChanged =
      claims.picture !== userData?.picture ||
      claims.given_name !== userData?.name;

    if (isNewUser || infoHasChanged) {
      await ddb.send(
        new PutItemCommand({
          TableName: Table.users.tableName,
          Item: marshall(userData),
        }),
      );
    }
  }
}
