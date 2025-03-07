import { IdTokenClaims } from 'openid-client';
import { UserContext } from '../UserContext';
import { UserServiceStep } from '../UserServiceStep';
import { VerifyDetailsService } from './VerifyDetailsService';
import { FetchUserService } from './FetchUserService';
import { UpdateUserService } from './UpdateUserService';

export class UserService {
  private services: UserServiceStep[] = [];

  constructor() {
    this.services = [
      new FetchUserService(),
      new VerifyDetailsService(),
      new UpdateUserService(),
    ];
  }

  async processUser(claims: IdTokenClaims): Promise<UserContext> {
    const context = new UserContext(claims);

    for (const service of this.services) {
      await service.handle(context);
    }

    return context;
  }
}
