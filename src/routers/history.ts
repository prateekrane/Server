import { Router } from "express";
import { mustAuth } from "../middleware/auth";
import {
  getHistories,
  getRecentlyPlayed,
  removeHistory,
  updateHistory,
} from "../controller/history";
import { validate } from "../middleware/validiator";
import { UpdateHistorySchema } from "../utils/validiationSchema";

const router = Router();
router.post("/", mustAuth, validate(UpdateHistorySchema), updateHistory);

router.delete("/", mustAuth, removeHistory);
router.get("/", mustAuth, getHistories);
router.get("/resently-played", mustAuth, getRecentlyPlayed);

export default router;
