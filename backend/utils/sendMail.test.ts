import { describe, test, expect, jest } from "@jest/globals";

import { sendMail } from "@app/utils";
import * as mailer from "@app/config/mailer.setup";

jest.mock("@app/config/mailer.setup", () => {
  const originalFactory = jest.requireActual("@app/config/mailer.setup") as any;

  return {
    __esModule: true,
    ...originalFactory,
    NODEMAILER_FROM: "test@example.com",
    isMailConfigured: true,
    transporter: {
      sendMail: jest.fn<any>().mockResolvedValue({}),
    },
  };
});

describe("sendMail tests", function () {
  test("transporter should give error on verify", async function () {
    expect.assertions(1);
    try {
      await mailer.transporter.verify();
    } catch (error) {
      // Check that the error message matches the expected error
      expect(error).toBeDefined();
    }
  });

  test("should throw error if mail not configured", async function () {
    (mailer.isMailConfigured as any) = false;
    const consoleSpy = jest.spyOn(console, "error");
    expect.assertions(1);
    // Call the sendMail function without configuring the mail system
    await sendMail({
      to: "",
      template: "signup",
      context: {
        subject: "Registration successfully",
        name: "",
        link: "",
      },
    });
    expect(consoleSpy).toHaveBeenCalledWith("error while sending mail", {
      error: new Error("Mail is not configured"),
    });
    (mailer.isMailConfigured as any) = true;
  });

  test("should return object after mail send success", async function () {
    // Call the sendMail function without configuring the mail system
    const result = await sendMail({
      to: "",
      template: "signup",
      context: {
        subject: "Registration successfully",
        name: "",
        link: "",
      },
    });
    expect(result).not.toBeNull();
  });
});
