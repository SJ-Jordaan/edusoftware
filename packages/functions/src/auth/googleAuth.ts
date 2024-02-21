import { StaticSite } from 'sst/node/site';
import { AuthHandler, GoogleAdapter, Session } from 'sst/node/auth';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Table } from 'sst/node/table';
import { Config } from 'sst/node/config';
import { UnauthorizedError } from '@edusoftware/core/types';

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
        try {
          const claims = tokenset.claims();
          if (
            !claims.email?.endsWith('@tuks.co.za') &&
            !claims.email?.endsWith('@up.ac.za') &&
            !claims.email?.endsWith('@cs.up.ac.za')
          ) {
            throw new UnauthorizedError('Email domain must be @tuks.co.za');
          }
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

          if (existingUser.Item) {
            const jsonUser = unmarshall(existingUser.Item);

            await ddb.send(
              new PutItemCommand({
                TableName: Table.users.tableName,
                Item: marshall({
                  userId: userId,
                  email: claims.email,
                  picture: claims.picture,
                  name: claims.given_name,
                  roles: jsonUser.roles,
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
                  roles: ['student'],
                }),
              }),
            );
          }

          const redirect = `${process.env.IS_LOCAL ? 'http://localhost:5173' : StaticSite.AutomaTutor.url}/login/callback`;

          return Session.parameter({
            redirect,
            type: 'user',
            properties: {
              userID: userId,
            },
          });
        } catch (error) {
          console.error('Error handling Google OAuth authentication:', error);

          if (error instanceof UnauthorizedError) {
            const errorRedirect = `${process.env.IS_LOCAL ? 'http://localhost:5173' : StaticSite.AutomaTutor.url}/login/unauthorized`;
            return Session.parameter({
              redirect: errorRedirect,
              type: 'public',
              properties: {
                error: error.message,
              },
            });
          }

          const errorRedirect = `${process.env.IS_LOCAL ? 'http://localhost:5173' : StaticSite.AutomaTutor.url}/login/failed`;
          return Session.parameter({
            redirect: errorRedirect,
            type: 'public',
            properties: {
              error: error instanceof Error ? error.message : error,
            },
          });
        }
      },
    }),
  },
});
