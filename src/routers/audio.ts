import { isVerified, mustAuth } from "../middleware/auth";
import { Router } from "express";
import fileParser from "../middleware/fileParser";
import { validate } from "../middleware/validiator";
import { AudioValidationSchema } from "../utils/validiationSchema";
import {
  createAudio,
  getLatestUploads,
  updateAudio,
} from "../controller/audio";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  createAudio
);

router.patch(
  "/:audioId",
  mustAuth,
  isVerified,
  fileParser,
  validate(AudioValidationSchema),
  updateAudio
);

router.get("/latest", getLatestUploads);

export default router;
