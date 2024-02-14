import { Bucket, StackContext } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  const competitionBucket = new Bucket(stack, "CompetitionBucket");

  return {
    competitionBucket
  }
}