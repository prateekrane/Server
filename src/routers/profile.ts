import { Router } from "express";
import { isAuth, mustAuth } from "../middleware/auth";
import {
  getAutoGeneratedPlaylist,
  getFollowersProfile,
  getFollowersProfilePublic,
  getFollowingsProfile,
  getIsFollowing,
  getPlaylistAudios,
  getPrivatePlaylistAudios,
  getPublicPlaylist,
  getPublicProfile,
  getPublicUploads,
  getRecommendByProfile,
  getUploads,
  updateFollower,
} from "../controller/profile";

const router = Router();
router.post("/update-follower/profileId", mustAuth, updateFollower);
router.get("/uploads", mustAuth, getUploads);
router.get("/uploads/:profileId", getPublicUploads);
router.get("/info/:profileId", getPublicProfile);
router.get("/iplaylist/:profileId", getPublicPlaylist);
router.get("/recommended", isAuth, getRecommendByProfile);
router.get("/auto-generated-playlist", mustAuth, getAutoGeneratedPlaylist);
router.get("/followers", mustAuth, getFollowersProfile);
router.get("/followers/:profileId", mustAuth, getFollowersProfilePublic);
router.get("/followings", mustAuth, getFollowingsProfile);
router.get("/playlist-audios/:playlistId", getPlaylistAudios);
router.get(
  "/private-playlist-audios/:playlistId",
  mustAuth,
  getPrivatePlaylistAudios
);
router.get("/is-following/:profileId", mustAuth, getIsFollowing);
export default router;
