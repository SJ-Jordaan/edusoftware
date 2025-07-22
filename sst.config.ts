import { SSTConfig } from 'sst';
import { StorageStack, ApiStack, FrontendStack, AuthStack, LtlApiStack } from "./stacks";
import { SecretStack } from './stacks/SecretStack';
import { LtlFrontendStack } from "./stacks/LtlFrontendStack";

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
      .stack(LtlApiStack)
      .stack(FrontendStack)
      .stack(LtlFrontendStack)
      .stack(AuthStack);
  },
} satisfies SSTConfig;
