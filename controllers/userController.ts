import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, RefreshTokenModel } from "../models/User";
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
    const token = generateToken(user._id.toString());
    const refreshToken = generateToken(user._id.toString());
    await new RefreshTokenModel({ token: refreshToken, user: user._id }).save();
    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      token: token,
    });
  } else {
    res.status(401).json({ error: "E-posta veya şifre hatalı" });
  }
};

export const logout = async (req: Request, res: Response) => {
  let token = req.headers.authorization;
  if (token && token.startsWith("Bearer")) token = token.split(" ")[1];
  try {
    await RefreshTokenModel.findOneAndDelete({ token: token });
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    res.status(500).json({ error: "Error logging out" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.body.token;

  // Öncelikle refresh token'ın veritabanında olup olmadığını kontrol et
  const tokenExists = await RefreshTokenModel.findOne({ token: token });
  if (!tokenExists) return res.status(403).json({ error: "Invalid refresh token" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, async (err: any, user: any) => {
    if (err) return res.sendStatus(403);

    const newToken = generateToken(user.id.toString());
    const newRefreshToken = generateToken(user.id.toString());

    // Eski refresh token'ı sil ve yeni refresh token'ı kaydet
    await RefreshTokenModel.deleteOne({ token: token });
    await new RefreshTokenModel({ token: newRefreshToken, user: user.id }).save();

    res.json({ token: newToken, refreshToken: newRefreshToken });
  });
};
