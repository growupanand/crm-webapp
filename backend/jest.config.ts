const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  /**
   * This will allow us to use typescript path alias (E.g. "@app/utils") in jest test cases
   */
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  setupFiles: ["./config/jest.setup.ts"],
};
