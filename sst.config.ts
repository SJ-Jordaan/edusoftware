import { SSTConfig } from 'sst';
import { StorageStack, ApiStack, FrontendStack, AuthStack } from './stacks';
import { SecretStack } from './stacks/SecretStack';

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
