import { IdTokenClaims } from 'openid-client';
import { OrganisationName, OrganisationRole } from '../../types';

export abstract class Organisation {
  protected claims: IdTokenClaims;

  constructor(claims: IdTokenClaims) {
    this.claims = claims;
  }

  abstract isMember(): boolean;
  abstract getRoles(): OrganisationRole[];
  abstract getName(): OrganisationName;
}
