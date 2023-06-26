import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testRegex: ".test.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
};

export default config;
