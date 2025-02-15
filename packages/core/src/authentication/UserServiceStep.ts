import { UserContext } from './UserContext';

export interface UserServiceStep {
  handle(userContext: UserContext): Promise<void>;
}
