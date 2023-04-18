import { describe, test, expect, beforeEach, jest } from "@jest/globals";
import {
  deleteAccessTokens,
  deleteEmailVerificationTokens,
  deleteRefreshTokens,
  deleteResetPasswordTokens,
  generateAccessToken,
  generateEmailVerificationToken,
  generateRefreshToken,
  generateResetPasswordToken,
  useToken,
} from "@app/utils";
import { isValidObjectId } from "mongoose";
import tokenModel from "@app/models/token";
const {
  Types: { ObjectId },
} = require("mongoose");

const user = {
  name: "test user",
  email: "testuser@email.com",
  _id: ObjectId("64383caac8c231e7e0101776"),
};

const validJwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCB1c2VyIiwiZW1haWwiOiJ0ZXN0dXNlckBlbWFpbC5jb20iLCJpYXQiOjE2ODE4Mzc0MjZ9.qUGJdV8kzsSpEupZILyPT-n-ERuhrDL38Y-exuhzGK4";
const notExistDBValidJwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCB1c2VyIiwiZW1haWwiOiJ0ZXN0dXNlckBlbWFpbC5jb20iLCJpYXQiOjE2ODE4Mzc4MDF9.rwUy9co8JPNOkxjcbq3gpKS-m5XCwKVyviDzYY5z_zY";

const inValidJwtToken = "aaaaaaaaaaaaaaaaaa";

// This will set environment variable needed for each test
beforeEach(() => {
  process.env.TOKEN_SECRET = "asdfsdfdsf";
  jest.clearAllMocks();
});

// This will mock tokenModel
jest.mock("@app/models/token", () => {
  const tokenModel = {
    __esModule: true,
    default: jest.fn().mockImplementation((data: any) => {
      return {
        ...data,
        save: jest.fn<any>().mockResolvedValue(data),
      };
    }) as jest.MockedFunction<any>,
  };

  tokenModel.default.deleteMany = jest
    .fn<any>()
    .mockImplementation((arg: any) => {
      if (!isValidObjectId(arg.userId)) {
        return Promise.reject(new Error("Invalid user id"));
      }
      return Promise.resolve(true);
    });
  tokenModel.default.deleteOne = jest.fn<any>().mockResolvedValue(true);
  tokenModel.default.findOne = jest
    .fn<any>()
    .mockImplementation((query: any) => {
      if (query.token === validJwtToken) {
        return Promise.resolve({ userId: "user_id" });
      } else {
        return Promise.resolve(null);
      }
    });
  return tokenModel;
});

describe("generateToken tests", function () {
  test("should not generate token if TOKEN_SECRET is not set in environment", async function () {
    delete process.env.TOKEN_SECRET;
    expect.assertions(1);
    try {
      await generateAccessToken(user);
    } catch (error) {
      expect(error).toEqual(new Error("Token not generated"));
    }
  });
});

[
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generateResetPasswordToken,
].forEach((generateTokenFunction) => {
  describe(`${generateTokenFunction.name} tests`, function () {
    test("should return jwt token", async function () {
      const generatedToken = await generateTokenFunction(user);
      expect(generatedToken.split(".").length).toEqual(3);
    });

    test("should not return jwt token for invalid user object", async function () {
      expect.assertions(1);
      try {
        await generateTokenFunction({} as any);
      } catch (error) {
        expect(error).toEqual(
          new Error("Unable to generate token. Invalid User Id.")
        );
      }
    });
  });
});

[
  deleteAccessTokens,
  deleteRefreshTokens,
  deleteEmailVerificationTokens,
  deleteResetPasswordTokens,
].forEach((deleteTokenFunction) => {
  describe(`${deleteTokenFunction.name} tests`, function () {
    test("should return true if token deleted", async function () {
      const isDeleted = await deleteTokenFunction(user);
      expect(isDeleted).toEqual(true);
    });

    test("should return false if token not deleted due to invalid user object", async function () {
      const isDeleted = await deleteTokenFunction({} as any);
      expect(isDeleted).toEqual(false);
    });
  });
});

describe("useToken tests", function () {
  test("should return null if invalid jwt token passed", async function () {
    const payload = await useToken(inValidJwtToken);
    expect(payload).toEqual(null);
  });

  test("should return payload for valid jwt token passed", async function () {
    const payload = await useToken(validJwtToken);
    expect(payload!.name).toEqual("test user");
    expect(tokenModel.findOne).toHaveBeenCalledTimes(1);
    expect(tokenModel.findOne).toHaveBeenCalledWith({ token: validJwtToken });
    expect(tokenModel.deleteOne).toHaveBeenCalledTimes(1);
    expect(tokenModel.deleteOne).toHaveBeenCalledWith({ token: validJwtToken });
  });

  test("should not delete token", async function () {
    await useToken(validJwtToken, false);
    expect(tokenModel.deleteOne).not.toBeCalled();
  });

  test("should not check for token existence in database", async function () {
    await useToken(validJwtToken, false, false);
    expect(tokenModel.findOne).not.toBeCalled();
  });

  test("should throw error if token not exist in database", async function () {
    const payload1 = await useToken(notExistDBValidJwtToken, false, false);
    expect(payload1!.name).toEqual("test user");
    const payload2 = await useToken(notExistDBValidJwtToken, false, true);
    expect(payload2).toEqual(null);
  });
});
