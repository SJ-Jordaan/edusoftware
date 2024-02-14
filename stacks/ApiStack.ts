import { Api, StackContext } from "sst/constructs";

export function ApiStack({ stack, app }: StackContext) {
  const api = new Api(stack, "Api", {
    customDomain: app.stage === "prod" ? "api.edusoftware.net" : undefined,
    defaults: {
      function: {
        environment: {
          MONGODB_URI: process.env.MONGODB_URI,
        },
      },
    },
    routes: {
      "GET /": "packages/functions/src/lambda.handler",
    },
  });

  stack.addOutputs({
    url: api.customDomainUrl ?? api.url,
  });

  return {
    api,
  };
}