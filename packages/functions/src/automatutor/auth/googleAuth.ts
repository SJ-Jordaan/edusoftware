import { StaticSite } from 'sst/node/site';
import { AuthHandler, GoogleAdapter, Session } from 'sst/node/auth';
import { Config } from 'sst/node/config';
import { UnauthorizedError } from '@edusoftware/core/types';
import { UserService } from '@edusoftware/core/authentication';
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
          const userService = new UserService();
          const processedUser = await userService.processUser(claims);

          const redirect = `${process.env.IS_LOCAL ? 'http://localhost:5173' : StaticSite.AutomaTutor.url}/login/callback`;

          return Session.parameter({
            redirect,
            type: 'user',
            properties: {
              userId: processedUser.userId,
              name: processedUser.userData!.name,
              picture: processedUser.userData!.picture,
              email: processedUser.userData!.email,
              organisations: processedUser.userData!.organisations,
              roles: processedUser.userData!.roles,
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
