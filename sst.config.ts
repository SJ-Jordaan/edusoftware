import { SSTConfig } from 'sst';
import { StorageStack, ApiStack, FrontendStack, AuthStack } from './stacks';

export default {
  config() {
    return {
      name: 'EduSoftware',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app
      .stack(StorageStack)
      .stack(ApiStack)
      .stack(FrontendStack)
      .stack(AuthStack);
  },
} satisfies SSTConfig;
