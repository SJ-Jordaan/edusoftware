import { Organisation } from "./Organisation";

export class TuksOrganisation extends Organisation {
  isMember(): boolean {
    return (
      this.claims.email?.endsWith('@tuks.co.za') ||
      this.claims.email?.endsWith('@up.ac.za') ||
      this.claims.email?.endsWith('@cs.up.ac.za')
    ) ?? false;
  }

  getRoles(): string[] {
    return ['student'];
  }
}