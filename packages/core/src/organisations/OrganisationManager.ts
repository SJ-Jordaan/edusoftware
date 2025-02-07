import { Claims } from "../types";
import { Organisation, PublicOrganisation, TuksOrganisation } from "./composites";

export class OrganisationManager {
  private organisations: Organisation[];
  private userOrganisations: Organisation[] = [];

  constructor(claims: Claims) {
    this.organisations = [new TuksOrganisation(claims), new PublicOrganisation(claims)];
    this.assignUserOrganisations();
  }

  private assignUserOrganisations(): void {
    this.userOrganisations = this.organisations.filter(org => org.isMember());
  }

  getUserRoles(): string[] {
    return this.userOrganisations.flatMap(org => org.getRoles());
  }

  getUserOrganisations(): string[] {
    return this.userOrganisations.map(org => org.constructor.name);
  }
}