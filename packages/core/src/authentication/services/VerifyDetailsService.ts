import { UserServiceStep } from '../UserServiceStep';
import { UserContext } from '../UserContext';
import { OrganisationManager } from '../../organisations';

export class VerifyDetailsService implements UserServiceStep {
  async handle(context: UserContext): Promise<void> {
    const orgManager = new OrganisationManager(context.claims);
    const defaultRoles = orgManager.getUserRoles();
    const defaultOrganisations = orgManager.getUserOrganisations();

    if (!context.userData) {
      context.userData = {
        userId: context.userId,
        email: context.claims.email ?? '',
        picture: context.claims.picture ?? '',
        name: context.claims.given_name ?? '',
        roles: defaultRoles,
        organisations: defaultOrganisations,
      };
    }

    if (!context.userData.roles?.length) {
      context.userData.roles = defaultRoles;
    }

    if (!context.userData.organisations?.length) {
      context.userData.organisations = defaultOrganisations;
    }
  }
}
