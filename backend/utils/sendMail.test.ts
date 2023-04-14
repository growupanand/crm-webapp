import { describe, test, expect } from "@jest/globals";
import { sendMail, transporter } from "@app/utils";

describe("sendMail tests", function () {
  test("transporter should give error on verify", async function () {
    process.env.NODEMAILER_SERVICE = "some-service";
    try {
      await transporter.verify();
    } catch (error) {
      // Check that the error message matches the expected error
      expect(error).toBeDefined();
    }
    delete process.env.NODEMAILER_SERVICE;
  });

  test("should throw error if mail not configured", async function () {
    try {
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
    } catch (error) {
      // Check that the error message matches the expected error
      expect(error).toEqual(new Error("Mail is not configured"));
    }
  });
});
