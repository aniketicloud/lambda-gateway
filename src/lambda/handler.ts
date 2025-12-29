import { APIGatewayProxyEventV2 } from "aws-lambda";
import crypto from "crypto";
import { fetchSecret } from "../utils/fetchSecret";

export const lambdaExample = async (event: any) => {
  console.log("TEMP Event log", event);
  return {
    message: "Hello World",
  };
};

export const homeRoute = async (event: APIGatewayProxyEventV2) => {
  console.log("Home Route Event Log", event);
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
    : "Welcome, Guest!";
  return {
    statusCode: 200,
    body: JSON.stringify({
      message,
    }),
  };
};

export const loginRoute = async (event: APIGatewayProxyEventV2) => {
  try {
    const username = JSON.parse(event.body ?? "{}");
    const secretValue = await fetchSecret(process.env.SECRET_ID!); // add secret name or secret arn
    const { encryptionKey } = JSON.parse(secretValue); // add seecret value of encryptionKey with some value in AWS Secret Manager !! CHARGEABLE in AWS !!
    const hashUsername = crypto
      .createHmac("sha256", encryptionKey)
      .update(username)
      .digest("hex");
    return {
      statusCode: 200,
      body: JSON.stringify({
        username: hashUsername,
      }),
    };
  } catch (error) {
    console.error("Error in loginRoute:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Something went wrong",
      }),
    };
  }
};
