import { testEnv } from "@app/constants";

/**
 * This file will be called by jest to load environment variables
 */
Object.keys(testEnv).forEach(
  (keyName) => (process.env[keyName] = testEnv[keyName])
);
