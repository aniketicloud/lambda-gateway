export const lambdaExample = async (event: any) => {
  console.log("TEMO Event log", event);
  return {
    message: "Hello World",
  };
};
