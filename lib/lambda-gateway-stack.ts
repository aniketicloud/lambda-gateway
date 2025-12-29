import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";
import * as apigateway from "aws-cdk-lib/aws-apigatewayv2";
import * as apigateway_integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { SecretsStack } from "./secrets-stack";

export class LambdaGatewayStack extends cdk.Stack {
  private readonly secretsStack: SecretsStack;

  constructor(
    scope: Construct,
    id: string,
    props: cdk.StackProps & { secretsStack: SecretsStack }
  ) {
    super(scope, id, props);

    this.secretsStack = props.secretsStack;

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

    const homeLambda = new NodejsFunction(this, "HomeHandler", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../src/lambda/handler.ts"),
      handler: "homeRoute", // same name as the exported function
      functionName: `${this.stackName}-home-route-lambda`,
    });

    const httpApi = new apigateway.HttpApi(this, "FirstApi", {
      apiName: "FirstApi",
      description: "First API with CDK",
      corsPreflight: {
        allowOrigins: ["*"],
        allowMethods: [apigateway.CorsHttpMethod.ANY],
        allowHeaders: ["*"],
      },
    });

    httpApi.addRoutes({
      integration: new apigateway_integrations.HttpLambdaIntegration(
        "HomeIntegration",
        homeLambda
      ),
      path: "/",
      methods: [apigateway.HttpMethod.GET],
    });

    new cdk.CfnOutput(this, "HttpUrl", {
      value: httpApi.url ?? "",
      description: "HTTP API URL",
    });

    const createProfileLambda = new NodejsFunction(
      this,
      "CreateProfileHandler",
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        entry: path.join(__dirname, "../src/lambda/handler.ts"),
        handler: "createProfileRoute", // same name as the exported function
        functionName: `${this.stackName}-create-profile-lambda`,
      }
    );

    httpApi.addRoutes({
      integration: new apigateway_integrations.HttpLambdaIntegration(
        "CreateProfileIntegration",
        createProfileLambda
      ),
      path: "/profile",
      methods: [apigateway.HttpMethod.POST],
    });

    const welcomeLambda = new NodejsFunction(this, "WelcomeHandler", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../src/lambda/handler.ts"),
      handler: "welcomeRoute",
      functionName: `${this.stackName}-welcome-handler-lambda`,
      environment: {
        USERNAME: "Value from CDK lambda options",
      },
    });
    // welcomeLambda.addEnvironment('USERNAME', 'Value from CDK lambda Outer')

    httpApi.addRoutes({
      integration: new apigateway_integrations.HttpLambdaIntegration(
        "WelcomeLambdaIntegration",
        welcomeLambda
      ),
      path: "/welcome",
      methods: [apigateway.HttpMethod.GET],
    });

    const loginLambda = new NodejsFunction(this, "LoginHandler", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(__dirname, "../src/lambda/handler.ts"),
      handler: "loginRoute",
      functionName: `${this.stackName}-login-handler-lambda`,
    });
    loginLambda.addEnvironment(
      "SECRET_ID",
      this.secretsStack.secret.secretName
    ); // SECRET_ID is required in handler.ts

    httpApi.addRoutes({
      integration: new apigateway_integrations.HttpLambdaIntegration(
        "LoginLambdaIntegration",
        loginLambda
      ),
      path: "/login",
      methods: [apigateway.HttpMethod.POST],
    });
  }
}
