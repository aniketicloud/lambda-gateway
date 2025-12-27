#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { LambdaGatewayStack } from "../lib/lambda-gateway-stack";
import { SecretsStack } from "../lib/secrets-stack";

const app = new cdk.App();

const secretsStack = new SecretsStack(app, "SecretsStack");
const lambdaGatewayStack = new LambdaGatewayStack(app, "LambdaGatewayStack", {
  secretsStack,
});

lambdaGatewayStack.addDependency(secretsStack);
