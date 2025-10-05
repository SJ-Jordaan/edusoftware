import { StaticSite } from 'sst/node/site';
import { AuthHandler, GoogleAdapter, Session } from 'sst/node/auth';
import { Config } from 'sst/node/config';
import { UnauthorizedError } from '@edusoftware/core/types';
import { UserService } from '@edusoftware/core/authentication';

function buildSuccessHandler(app: 'automatutor' | 'logictutor') {
  return async (tokenset: import('openid-client').TokenSet) => {
    try {
      const claims = tokenset.claims();
      const userService = new UserService();
      const processedUser = await userService.processUser(claims);

      console.log('Google auth success via provider for app:', app);

      const redirectBase = process.env.IS_LOCAL
        ? 'http://localhost:5173'
        : app === 'logictutor'
          ? StaticSite.LogicTutor.url
          : StaticSite.AutomaTutor.url;

      const redirect = `${redirectBase}/login/callback`;

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
      console.error(
        'Error handling Google OAuth authentication for',
        app,
        error,
      );

      const base = process.env.IS_LOCAL
        ? 'http://localhost:5173'
        : app === 'logictutor'
          ? StaticSite.LogicTutor.url
          : StaticSite.AutomaTutor.url;

      const fallbackRedirect = (path: string) =>
        Session.parameter({
          redirect: `${base}${path}`,
          type: 'public',
          properties: {
            error: error instanceof Error ? error.message : String(error),
          },
        });

      if (error instanceof UnauthorizedError) {
        return fallbackRedirect('/login/unauthorized');
      }

      return fallbackRedirect('/login/failed');
    }
  };
}

export const handler = AuthHandler({
  providers: {
    // AutomaTutor (default) uses original client ID
    google: GoogleAdapter({
      mode: 'oidc',
      clientID: Config.GOOGLE_CLIENT_ID,
      onSuccess: buildSuccessHandler('automatutor'),
    }),
    // LogicTutor uses its own dedicated Google client ID
    googlelogic: GoogleAdapter({
      mode: 'oidc',
      // Access LogicTutor specific client ID (bound via SecretStack)
      clientID: (
        Config as unknown as {
          LOGIC_GOOGLE_CLIENT_ID: string;
        }
      ).LOGIC_GOOGLE_CLIENT_ID,
      onSuccess: buildSuccessHandler('logictutor'),
    }),
  },
});
