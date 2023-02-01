import userModel from "@app/models/user";
import { Request, Response } from "express";

/**
 * Get any user details
 * @param req
 * @param res
 * @returns
 */
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

/**
 * Delete current logged in user
 * @param req
 * @param res
 * @returns
 */
const deleteUser = async (req: Request, res: Response) => {
  const { user } = req;
  try {
    await userModel.deleteOne({ _id: user._id });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    return res.sendCustomErrorMessage(error.message);
  }
};

export default { getUser, deleteUser };
