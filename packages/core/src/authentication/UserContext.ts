import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { UserSession } from '../types';
import { IdTokenClaims } from 'openid-client';

export class UserContext {
  userId: string;
  claims: IdTokenClaims;
  userData: UserSession | undefined;
  ddb: DynamoDBClient;
  isNewUser: boolean;

  constructor(claims: IdTokenClaims) {
    this.userId = claims.sub;
    this.claims = claims;
    this.ddb = new DynamoDBClient({});
    this.isNewUser = true;
  }
}
