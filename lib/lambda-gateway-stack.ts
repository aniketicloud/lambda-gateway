import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

export class LambdaGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const exampleLambda = new NodejsFunction(this, "ExampleHandler", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../src/lambda/handler.ts"),
      handler: "lambdaExample", // same name as the exported function
      functionName: `${this.stackName}-cdk-course-example-lambda`,
    });

    new cdk.CfnOutput(this, "ExampleLambdaArn", {
      value: exampleLambda.functionArn,
      description: "The ARN of the example Lambda function",
    });
  }
}
