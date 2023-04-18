import { describe, test, expect, beforeEach, jest } from "@jest/globals";

describe("@app/mailer tests", function () {
  const cloneProcessEnv = process.env;

  /** Check if all environment variables valid used by nodemailer */
  const isValidConfig = () => {
    const { testEnv } = require("@app/constants");
    const {
      NODEMAILER_USER,
      NODEMAILER_PASS,
      NODEMAILER_SERVICE,
      NODEMAILER_HOST,
      NODEMAILER_PORT,
    } = process.env;
    return (
      ![NODEMAILER_USER, NODEMAILER_PASS].includes(undefined) &&
      (NODEMAILER_SERVICE === undefined
        ? ![NODEMAILER_HOST, NODEMAILER_PORT].includes(undefined)
        : NODEMAILER_SERVICE === testEnv.NODEMAILER_SERVICE)
    );
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    // Reset process.env to original
    process.env = { ...cloneProcessEnv };

    // Mock nodemailer.createTransport() which return transporter
    const nodemailer = require("nodemailer");
    const spyNodemailer = jest.spyOn(nodemailer, "createTransport");
    spyNodemailer.mockReturnValue({
      /**
       * Here we will mock transporter.verify() method,
       *
       * Condition-1: Valid nodemailer configuration
       * verify() method will not throw error,
       *
       * Condition-2: Invalid nodemailer configuration
       * verify() method will throw error
       */
      verify: (cb: any) => {
        cb?.(isValidConfig() ? null : "Invalid config");
      },
      // Need to mock use() also as it will always called by @app/mailer
      use: jest.fn(),
    });
  });

  describe("With invalid config", function () {
    test("transporter should give error on verify", async function () {
      process.env = {};
      const { transporter } = require("@app/config/mailer.setup");
      expect.assertions(1);
      try {
        const ets = await transporter.verify((error: any) => {
          if (error) throw new Error(error);
        });
        expect(ets).not.toEqual(undefined);
      } catch (error) {
        // Check that the error message matches the expected error
        expect(error).toEqual(new Error("Invalid config"));
      }
    });
  });

  describe("With valid config", function () {
    test("transporter should not give error on verify", async function () {
      const { isMailConfigured } = require("@app/config/mailer.setup");
      expect(isMailConfigured).toEqual(true);
    });

    test("transporter should not give error on verify (Service Based Config)", async function () {
      delete process.env.NODEMAILER_SERVICE;
      const { transporter } = require("@app/config/mailer.setup");
      expect(await transporter.verify()).toBeUndefined();
    });
  });
});
