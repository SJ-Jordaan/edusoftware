import { SSTConfig } from 'sst';
import { StorageStack, ApiStack, FrontendStack } from './stacks';

export default {
  config(_input) {
    return {
      name: 'EduSoftware',
      region: 'us-east-1',
    };
  },
  stacks(app) {
    app.stack(ApiStack).stack(StorageStack).stack(FrontendStack);
  },
} satisfies SSTConfig;
