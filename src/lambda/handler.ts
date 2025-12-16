import { APIGatewayProxyEventV2 } from "aws-lambda";

export const lambdaExample = async (event: any) => {
  console.log("TEMP Event log", event);
  return {
    message: "Hello World",
  };
};

export const homeRoute = async (event: APIGatewayProxyEventV2) => {
  console.log("Home Route Evene Log", event);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Welcome to the Home Route!",
    }),
  };
};

export const createProfileRoute = async (event: APIGatewayProxyEventV2) => {
  console.log("TEMP POST Event: ", event);
  const body = JSON.parse(event.body ?? "{}");
  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "Profile created successfully!",
      username: body.username,
    }),
  };
};

export const welcomeRoute = async (event: APIGatewayProxyEventV2) => {
  const username = process.env.USERNAME;
  const message = username
    ? "Welcome back, " + username + "!"
    : "Welcome, guest!";
  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
    }),
  };
};
