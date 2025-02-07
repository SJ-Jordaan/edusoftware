import { Claims } from "../../types";

export abstract class Organisation {
  protected claims: Claims;

  constructor(claims: Claims) {
    this.claims = claims;
  }

  abstract isMember(): boolean;
  abstract getRoles(): string[];
}