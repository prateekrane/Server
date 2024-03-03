import { Router } from "express";
import { isVerified, mustAuth } from "../middleware/auth";
import {
  getFavorites,
  getIsFavorites,
  toggleFavorite,
} from "../controller/favroite";

const router = Router();

router.post("/", mustAuth, isVerified, toggleFavorite);
router.get("/", mustAuth, getFavorites);
router.get("/is-fav", mustAuth, getIsFavorites);
export default router;
