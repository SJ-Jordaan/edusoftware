import { StaticSite } from 'sst/node/site';
import { AuthHandler, GoogleAdapter, Session } from 'sst/node/auth';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Table } from 'sst/node/table';
import { Config } from 'sst/node/config';

declare module 'sst/node/auth' {
  export interface SessionTypes {
    user: {
      userID: string;
    };
  }
}

/**
 * The handler for Google OAuth authentication.
 * It checks if the user already exists in the database.
 * If not, it adds the user along with the default roles.
 * If the user exists, it keeps the existing roles.
 */
export const handler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: 'oidc',
      clientID: Config.GOOGLE_CLIENT_ID,
      onSuccess: async (tokenset) => {
        console.log('Google tokenset', tokenset);
        console.log('Google client id', Config.GOOGLE_CLIENT_ID);
        const claims = tokenset.claims();
        const userId = claims.sub;
        const ddb = new DynamoDBClient({});
        const userKey = marshall({ userId: userId });

        // Check if user already exists
        const existingUser = await ddb.send(
          new GetItemCommand({
            TableName: Table.users.tableName,
            Key: userKey,
          }),
        );

        // If user does not exist, add them with default roles
        if (!existingUser.Item) {
          await ddb.send(
            new PutItemCommand({
              TableName: Table.users.tableName,
              Item: marshall({
                userId: userId,
                email: claims.email,
                picture: claims.picture,
                name: claims.given_name,
                roles: ['student'],
              }),
            }),
          );
        } else {
          await ddb.send(
            new PutItemCommand({
              TableName: Table.users.tableName,
              Item: marshall({
                userId: userId,
                email: claims.email,
                picture: claims.picture,
                name: claims.given_name,
                roles: existingUser.Item.roles,
              }),
            }),
          );
        }

        console.log(
          'User added to database',
          userId,
          claims.given_name,
          claims.email,
          claims.picture,
        );

        const redirect = `${process.env.IS_LOCAL ? 'http://localhost:5173' : StaticSite.AutomaTutor.url}/login/callback`;

        return Session.parameter({
          redirect,
          type: 'user',
          properties: {
            userID: userId,
          },
        });
      },
    }),
  },
});
