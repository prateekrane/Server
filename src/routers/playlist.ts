import { Router } from "express";
import { isVerified, mustAuth } from "../middleware/auth";
import {
  NewPlaylistValidationSchema,
  OldPlaylistValidationSchema,
} from "../utils/validiationSchema";
import { validate } from "../middleware/validiator";
import {
  createPLayList,
  getAudios,
  getPlaylistByProfile,
  removePlaylist,
  updatePLayList,
} from "../controller/playList";

const router = Router();

router.post(
  "/create",
  mustAuth,
  isVerified,
  validate(NewPlaylistValidationSchema),
  createPLayList
);

router.patch(
  "/",
  mustAuth,
  validate(OldPlaylistValidationSchema),
  updatePLayList
);
router.delete("/", mustAuth, removePlaylist);
router.get("/by-profile", mustAuth, getPlaylistByProfile);
router.get("/:playlistId", mustAuth, getAudios);

export default router;
