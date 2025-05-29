import { SSTConfig } from 'sst';
import { StorageStack, ApiStack, AuthStack } from './stacks';
import { SecretStack } from './stacks/SecretStack';
import { FrontendStack } from './stacks/FrontendStack';

export default {
  config() {
    return {
      name: 'EduSoftware',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app
      .stack(SecretStack)
      .stack(StorageStack)
      .stack(ApiStack)
      .stack(FrontendStack)
      .stack(AuthStack);
  },
} satisfies SSTConfig;
