import { Organisation } from "./Organisation";

export class PublicOrganisation extends Organisation {
  isMember(): boolean {
    return true;
  }

  getRoles(): string[] {
    return ['student'];
  }
}