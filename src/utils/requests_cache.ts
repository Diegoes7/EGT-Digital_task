//iIn-flight request cache that you are using to prevent duplicate API requests 
const inFlightRequests: Record<string, Promise<any>> = {};

export const getRequest = (key: string) => inFlightRequests[key];

export const setRequest = (key: string, promise: Promise<any>) => {
  inFlightRequests[key] = promise;
};

export const clearRequest = (key: string) => {
  delete inFlightRequests[key];
};
