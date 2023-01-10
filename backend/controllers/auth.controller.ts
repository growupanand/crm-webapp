import { Request, Response } from "express";
import User from "@models/user";
import bcrypt from "bcrypt";

const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  // create new user in database
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });
  newUser.save((saveErr, savedData) => {
    if (saveErr) {
      return res.sendMongooseErrorResponse(saveErr);
    }
    return res.status(200).json(savedData);
  });
};

export default { register };
