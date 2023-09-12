import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import generateToken from "../utils/generateToken";

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).json({ error: "Kullanıcı zaten mevcut" });
    return;
  }

  const user = new User({
    email,
    password,
    name,
  });

  await user.save();

  res.status(201).json({
    _id: user._id,
    email: user.email,
    name: user.name,
    token: generateToken(user._id.toString()),
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401).json({ error: "E-posta veya şifre hatalı" });
  }
};