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

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const errMessage = "Username or password is incorrect";
  // check if user exist with provided email
  const user = await User.findOne({ email });
  if (!user) return res.sendCustomErrorMessage(errMessage, 400);

  // check if password provided is correct
  bcrypt.compare(password, user.password, (error, result) => {
    if (error || !result) {
      return res.sendCustomErrorMessage(errMessage, 400);
    }
    // create access token
    const payload = {
      name: user.name,
      email: user.email,
    };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET as string
    );
    return res.status(200).json({ accessToken });
  });
};

export default { register, login };
