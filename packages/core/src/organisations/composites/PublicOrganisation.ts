import { OrganisationName, OrganisationRole } from '../../types';
import { Organisation } from './Organisation';

export class PublicOrganisation extends Organisation {
  isMember(): boolean {
    return true;
  }

  getRoles(): OrganisationRole[] {
    return [OrganisationRole.STUDENT];
  }

  getName(): OrganisationName {
    return OrganisationName.PUBLIC;
  }
}
