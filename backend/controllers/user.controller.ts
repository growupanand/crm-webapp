import userModel from "@app/models/user";
import { sendMail } from "@app/utils/sendMail";
import { Request, Response } from "express";
import { baseUrl } from "..";
import {
  deleteEmailVerificationTokens,
  generateEmailVerificationToken,
} from "@app/utils";

/** Get any user details */
const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const commonErrorMessage = "User not found";
  if (!userId) return res.sendCustomErrorMessage(commonErrorMessage, 400);
  // check if current user information requested
  if (userId === "me") {
    return res.status(200).json({
      ...req.user,
    });
  }
  try {
    const user = await userModel.findOne({ _id: userId });
    if (!user) return res.sendCustomErrorMessage(commonErrorMessage, 400);
    const { password, ...userJson } = user.toJSON();
    return res.status(200).json({
      ...userJson,
    });
  } catch (_error) {
    return res.sendCustomErrorMessage(commonErrorMessage, 400);
  }
};

/** Delete current logged in user */
const deleteUser = async (req: Request, res: Response) => {
  const { user } = req;
  try {
    await userModel.deleteOne({ _id: user._id });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    return res.sendCustomErrorMessage(error.message);
  }
};

/** Resend email verification mail */
const resendEmailVerify = async (req: Request, res: Response) => {
  const { user } = req;
  // don't send mail if user is already verified
  if (user.isEmailVerified)
    return res.sendCustomErrorMessage("User is already verified");
  // Delete old email verification tokens of this user
  await deleteEmailVerificationTokens(user);
  const newEmailVerificationToken = await generateEmailVerificationToken(user);
  const data = await sendMail({
    to: user.email,
    template: "verifyMail",
    context: {
      subject: "Verification Mail",
      name: user.name,
      link: `${baseUrl}api/auth/verifyEmail/${newEmailVerificationToken}/`,
    },
  });
  if (!data) {
    return res.sendCustomErrorMessage("Unable to send verification mail", 500);
  }

  return res
    .status(200)
    .json({ message: "Verification mail sent successfully" });
};

export default { getUser, deleteUser, resendEmailVerify };
