export const lambdaExample = async (event: any) => {
  console.log("TEMP Event log", event);
  return {
    message: "Hello World",
  };
};
