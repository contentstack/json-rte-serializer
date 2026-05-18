module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.setup.js"],
  testResultsProcessor: "./node_modules/jest-html-reporter",
};