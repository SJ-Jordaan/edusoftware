import { Bucket, StackContext, Table } from 'sst/constructs';

export function StorageStack({ stack }: StackContext) {
  const competitionBucket = new Bucket(stack, 'CompetitionBucket');

  const userTable = new Table(stack, 'users', {
    fields: {
      userId: 'string',
    },
    primaryIndex: { partitionKey: 'userId' },
  });

  return {
    competitionBucket,
    userTable,
  };
}
