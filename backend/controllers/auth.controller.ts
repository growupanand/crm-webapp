import { Request, Response } from "express";
import User from "@models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    // create access token
    const payload = {
      name: savedData.name,
      email: savedData.email,
    };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    return res.status(200).json({ accessToken });
  });
};

export default { register };
