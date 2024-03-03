import { RequestHandler } from "express";
import passwordResetToken from "../model/passwordResetToken";
import { JwtPayload, verify } from "jsonwebtoken";
import User from "../model/user";
import { JWT_SECRET } from "../utils/variables";

export const isValidPassResetToken: RequestHandler = async (req, res, next) => {
  const { token, userId } = req.body;

  const resetToken = await passwordResetToken.findOne({ owner: userId });
  if (!resetToken)
    return res
      .status(403)
      .json({ error: "Unauthorized access, invalid token! " });

  const matched = await resetToken.compareToken(token);
  if (!matched)
    return res
      .status(403)
      .json({ error: "Unauthorized access, invalid token! " });

  next();
};

export const mustAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];
  if (!token) return res.status(403).json({ error: "Unauthorized Request!" });

  const payload = verify(token, JWT_SECRET) as JwtPayload;
  const id = payload.userId;

  const user = await User.findOne({ _id: id, tokens: token });
  if (!user) return res.status(403).json({ error: "Unauthorized Request!" });

  (req.user = {
    id: user._id,
    name: user.name,
    email: user.email,
    verified: user.verification,
    avatar: user.avtar,
    followers: user.followers,
    following: user.following.length,
  }),
    (req.token = token);
  next();
};

export const isVerified: RequestHandler = (req, res, next) => {
  if (!req.user.verified)
    return res.status(403).json({ error: "Unauthorized Request!" });
  next();
};

export const isAuth: RequestHandler = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.split("Bearer ")[1];

  if (token) {
    const payload = verify(token, JWT_SECRET) as JwtPayload;
    const id = payload.userId;

    const user = await User.findOne({ _id: id, tokens: token });
    if (!user) return res.status(403).json({ error: "Unauthorized Request!" });

    (req.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verification,
      avatar: user.avtar,
      followers: user.followers,
      following: user.following.length,
    }),
      (req.token = token);
  }

  next();
};
