import { IdTokenClaims } from 'openid-client';
import { OrganisationName, OrganisationRole } from '../types';
import {
  Organisation,
  PublicOrganisation,
  TuksOrganisation,
} from './composites';

export class OrganisationManager {
  private organisations: Organisation[];
  private userOrganisations: Organisation[] = [];

  constructor(claims: IdTokenClaims) {
    this.organisations = [
      new TuksOrganisation(claims),
      new PublicOrganisation(claims),
    ];
    this.assignUserOrganisations();
  }

  private assignUserOrganisations(): void {
    this.userOrganisations = this.organisations.filter((org) => org.isMember());
  }

  getUserRoles(): OrganisationRole[] {
    return this.userOrganisations.flatMap((org) => org.getRoles());
  }

  getUserOrganisations(): OrganisationName[] {
    return this.userOrganisations.map((org) => org.getName());
  }
}
