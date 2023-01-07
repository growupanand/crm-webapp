import { Request, Response } from "express";
import User from "@models/user";
import { sendMongooseErrorResponse } from "@utils/index";

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  // create new user in database
  const newUser = new User({
    name,
    email,
    password,
  });
  newUser.save((saveErr, savedData) => {
    if (saveErr) {
      sendMongooseErrorResponse(saveErr, res);
    }
    return res.status(200).json(savedData);
  });
};

export default { register };
