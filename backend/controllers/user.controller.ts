import userModel from "@app/models/user";
import { Request, Response } from "express";

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

export default { getUser };
