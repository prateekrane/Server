import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { CreateUser } from "../@types/user";
import User from "../model/user";
import { formatProfile, generateToken } from "../utils/Helper";
import { sendPassResetSuccessEmail } from "../utils/mail";
import formidable from "formidable";
import { sendForgetPasswordLink, sendVerificationMail } from "../utils/mail";
import { VerifyEmailRequest } from "../@types/user";
import emailVerificationToken from "../model/emailVerificationToken";
import user from "../model/user";
import crypto from "crypto";
import cloudinary from "../Cloud";
import passwordResetToken from "../model/passwordResetToken";
import { isValidObjectId } from "mongoose";
import { JWT_SECRET, PASSWORD_RESET_LINK } from "../utils/variables";
import { RequestWithFiles } from "../middleware/fileParser";

// import { PassResetTokenSchema } from "../utils/validiationSchema";
export const create: RequestHandler = async function (req: CreateUser, res) {
  const { email, password, name } = req.body;

  const oldUser = await User.findOne({ email });

  if (oldUser) return res.status(403).json({ error: "Email already exist!" });

  const user = await User.create({ name, email, password });
  //send email verification
  const token = generateToken();
  await emailVerificationToken.create({
    owner: user._id,
    token,
  });
  sendVerificationMail(token, { name, email, userId: user._id.toString() });

  res.status(201).json({ user: { id: user._id, name, email } });
};
export const verifyEmail: RequestHandler = async function (
  req: VerifyEmailRequest,
  res
) {
  const { userId, token } = req.body;
  const verificationToken = await emailVerificationToken.findOne({
    owner: userId,
  });
  if (!verificationToken)
    return res.status(403).json({ error: "Invalid token!" });

  const matched = await verificationToken?.compareToken(token);
  if (!matched) return res.status(403).json({ error: "Invalid token!" });

  await user.findByIdAndUpdate(userId, {
    verification: true,
  });

  await emailVerificationToken.findByIdAndDelete(verificationToken._id);

  res.json({ message: "Your email is verified." });
};

export const sendReVerificationToken: RequestHandler = async (req, res) => {
  const { userId } = req.body;

  if (!isValidObjectId(userId))
    return res.status(403).json({ error: "Invalid request!" });

  const User = await user.findById(userId);
  if (!User) return res.status(403).json({ error: "Invalid Request!" });

  if (User.verification)
    return res.status(422).json({ error: "Already verified!" });

  await emailVerificationToken.findOneAndDelete({
    owner: userId,
  });
  const token = generateToken();

  await emailVerificationToken.create({
    owner: userId,
    token,
  });

  sendVerificationMail(token, {
    name: User?.name,
    email: User?.email,
    userId: User?._id.toString(),
  });
  res.json({ message: "Please check your mail!.." });
};

export const generateForgetPasswordLink: RequestHandler = async (req, res) => {
  const { email } = req.body;

  const User = await user.findOne({ email });
  if (!User) return res.status(404).json({ error: "Account not found!" });

  //generate the link
  await passwordResetToken.findOneAndDelete({
    owner: User._id,
  });

  const token = crypto.randomBytes(36).toString("hex");

  await passwordResetToken.create({
    owner: User._id,
    token,
  });

  const resetLink = `${PASSWORD_RESET_LINK}?token=${token}&userId=${User._id} `;
  sendForgetPasswordLink({ email: User.email, link: resetLink });
  res.json({ message: "check your registered mail." });
};

export const isValidPassResetToken: RequestHandler = async (req, res) => {
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

  res.json({ message: "Your token is valid" });
};

export const grantvalid: RequestHandler = async (req, res) => {
  res.json({ valid: true });
};

export const updatePassword: RequestHandler = async (req, res) => {
  const { password, userId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(403).json({ error: "Unauthorized access!" });

  const matched = await user.comparePassword(password);
  if (matched)
    return res
      .status(422)
      .json({ error: "the new password must be different" });

  user.password = password;
  await user.save();

  await passwordResetToken.findOneAndDelete({ owner: user._id });

  sendPassResetSuccessEmail(user.name, user.email);
  res.json({ message: "Password reset successfully." });
};
//kis pea kare yakin,kis seh kare gela, mere nashib nea mera yeh haal kar dia

export const signIn: RequestHandler = async (req, res) => {
  const { password, email } = req.body;

  const user = await User.findOne({
    email,
  });
  if (!user) return res.status(403).json({ error: "Email/Password Mismatch" });

  //compare the password

  const matched = await user.comparePassword(password);
  if (!matched)
    return res.status(403).json({ error: "Email/Password Mismatch" });

  //generate the token for later use.

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  user.tokens.push(token);

  await user.save();

  res.json({
    profile: {
      id: user._id,
      name: user.name,
      email: user.email,
      verified: user.verification,
      avatar: user.avtar,
      followers: user.followers,
      following: user.following.length,
    },
    token,
  });
};

export const updateProfile: RequestHandler = async (
  req: RequestWithFiles,
  res
) => {
  const { name } = req.body;
  const avatar = req.files?.avatar as unknown as formidable.File;

  const user = await User.findById(req.user.id);
  if (!user) throw new Error("something went wrong, user not found!");

  if (typeof name !== "string")
    return res.status(422).json({ error: "Invalid name!" });

  if (name.trim().length < 3)
    return res.status(422).json({ error: "Invalid name!" });

  user.name = name;

  if (avatar) {
    // if there is already an avatar file, we want to remove that
    if (user.avtar?.publicID) {
      await cloudinary.uploader.destroy(user.avtar?.publicID);
    }

    // upload new avatar file
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      avatar.filepath,
      {
        width: 300,
        height: 300,
        crop: "thumb",
        gravity: "face",
      }
    );

    user.avtar = { uri: secure_url, publicID: public_id };
  }

  await user.save();

  res.json({ profile: formatProfile(user) });
};

export const sendProfile: RequestHandler = (req, res) => {
  res.json({ profile: req.user });
};

export const logOut: RequestHandler = async (req, res) => {
  const { fromAll } = req.query;

  const token = req.token;
  const user = await User.findById(req.user.id);
  if (!user) throw new Error("something went wrong, user not found!");

  //check from the logout from all

  if (fromAll === "yes") user.tokens = [];
  else user.tokens = user.tokens.filter((t) => t !== token);
  await user.save();
  res.json({ sucess: true });
};
