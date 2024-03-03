import { Router } from "express";
import path from "path";
import fs from "fs";
import {
  generateForgetPasswordLink,
  logOut,
  sendProfile,
  signIn,
  updatePassword,
  updateProfile,
} from "../controller/auth";
import {
  create,
  grantvalid,
  verifyEmail,
  sendReVerificationToken,
} from "../controller/auth";
import { validate } from "../middleware/validiator";
import {
  CreateUserSchema,
  SignInValidationSchema,
  // EmailVerificationBody,
  TokenAndIDValidaion,
  UpdatePasswordSchema,
} from "../utils/validiationSchema";
import { isValidPassResetToken, mustAuth } from "../middleware/auth";
import { JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../utils/variables";
import User from "../model/user";
import formidable from "formidable";
import fileParser, { RequestWithFiles } from "../middleware/fileParser";
const router = Router();
router.post("/create", validate(CreateUserSchema), create);

router.post("/verify-email", validate(TokenAndIDValidaion), verifyEmail);

router.post("/re-verify-email", sendReVerificationToken);

router.post("/forget-password", generateForgetPasswordLink);

router.post(
  "/verify-pass-reset-token",
  validate(TokenAndIDValidaion),
  isValidPassResetToken,
  grantvalid
);
router.post(
  "/update-password",
  validate(UpdatePasswordSchema),
  isValidPassResetToken,
  updatePassword
);
router.post("/sign-in", validate(SignInValidationSchema), signIn);

router.get("/is-auth", mustAuth, sendProfile);

router.post("/update-profile", mustAuth, fileParser, updateProfile);

router.post("/log-out", mustAuth, logOut);
export default router;
