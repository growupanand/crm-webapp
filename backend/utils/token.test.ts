import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import { deleteAccessTokens, generateAccessToken } from "@app/utils";
const {
  Types: { ObjectId },
} = require("mongoose");

const user = {
  name: "test user",
  email: "testuser@email.com",
  _id: ObjectId("64383caac8c231e7e0101776"),
};

describe("token tests", function () {
  beforeEach(() => {
    // Mock the tokenModel module
    jest.mock("@app/models/token", () => ({
      __esModule: true,
      default: jest.fn().mockImplementation((data: any) => {
        return {
          ...data,
          save: jest.fn<any>().mockResolvedValue(data),
        };
      }),
    }));
  });
  afterEach(() => {
    jest.resetModules();
  });
  describe("generateToken tests", function () {
    test("should not generate token if TOKEN_SECRET is not set in environment", async function () {
      try {
        await generateAccessToken(user);
      } catch (error) {
        expect(error).toEqual(new Error("Token not generated"));
      }
    });
  });
  // describe("generateAccessToken tests", function () {
  //   beforeEach(() => {
  //     process.env.TOKEN_SECRET = "asdfsdfdsf";
  //   });
  //   afterEach(() => {
  //     delete process.env.TOKEN_SECRET;
  //   });
  //   test("should return jwt token", async function () {
  //     const generatedToken = await generateAccessToken(user);
  //     expect(generatedToken.split(".").length).toEqual(3);
  //   });
  //   test("should not return jwt token for invalid user object", async function () {
  //     try {
  //       await generateAccessToken({} as any);
  //     } catch (error) {
  //       expect(error).toEqual(
  //         new Error("Unable to generate token. Invalid User Id.")
  //       );
  //     }
  //   });
  // });
  // describe("deleteAccessTokens tests", function () {
  //   beforeEach(() => {
  //     // Mock the tokenModel module
  //     jest.mock("@app/models/token", () => ({
  //       __esModule: true,
  //       default: jest.fn().mockImplementation((data: any) => {
  //         return {
  //           ...data,
  //           save: jest.fn<any>().mockResolvedValue(data),
  //         };
  //       }),
  //     }));
  //   });
  // beforeEach(() => {
  //   // jest.resetModules();
  //   // Mock the tokenModel module
  //   jest.mock("@app/models/token", () => ({
  //     __esModule: true,
  //     deleteMany: jest.fn<any>((arg: any) => {
  //       console.log({ arg });
  //       return {
  //         arg,
  //         mockResolvedValue: () => true,
  //       };
  //     }),
  //   }));
  // });
  //   test("should return true if token deleted", async function () {
  //     const isDeleted = await deleteAccessTokens(user);
  //     expect(isDeleted).toEqual(true);
  //   });
  // });
});
