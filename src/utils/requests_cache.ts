// src/utils/requestCache.ts
const inFlightRequests: Record<string, Promise<any>> = {};

export const getRequest = (key: string) => inFlightRequests[key];

export const setRequest = (key: string, promise: Promise<any>) => {
  inFlightRequests[key] = promise;
};

export const clearRequest = (key: string) => {
  delete inFlightRequests[key];
};
