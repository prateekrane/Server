import { RequestHandler } from "express";
import {
  PopulateFavList,
  UpdatePLayListRequest,
  createPLayListRequest,
} from "../@types/audio";
import Audio from "../model/audio";
import Playlist from "../model/playlist";
import { isValidObjectId } from "mongoose";

export const createPLayList: RequestHandler = async (
  req: createPLayListRequest,
  res
) => {
  const { title, resId, visibility } = req.body;
  const ownerId = req.user.id;

  //create new playlist
  if (resId) {
    const audio = await Audio.findById(resId);
    if (!audio) return res.status(404).json({ error: "Resource not found" });
  }

  const newPlaylist = new Playlist({
    title,
    owner: ownerId,
    visibility,
  });

  if (resId) newPlaylist.items = [resId as any];
  await newPlaylist.save();
  res.status(201).json({
    playlist: {
      id: newPlaylist._id,
      title: newPlaylist.title,
      visibility: newPlaylist.visibility,
    },
  });
};

export const updatePLayList: RequestHandler = async (
  req: UpdatePLayListRequest,
  res
) => {
  const { id, item, title, visibility } = req.body;

  const playlist = await Playlist.findOneAndUpdate(
    { _id: id, owner: req.user.id },
    {
      title,
      visibility,
    },
    {
      new: true,
    }
  );
  if (!playlist) return res.status(404).json({ error: "Playlist not found" });

  if (item) {
    const audio = await Audio.findById(item);
    if (!audio) return res.status(404).json({ error: "Audio not found" });
    // playlist.items.push(audio._id);
    // await playlist.save();
    await Playlist.findByIdAndUpdate(playlist._id),
      {
        $addToset: { items: item },
      };
  }
  res.status(201).json({
    playlist: {
      id: playlist._id,
      title: playlist.title,
      visibility: playlist.visibility,
    },
  });
};

export const removePlaylist: RequestHandler = async (
  req: UpdatePLayListRequest,
  res
) => {
  const { playlistId, resId, all } = req.query;

  if (!isValidObjectId(playlistId))
    return res.status(422).json({ error: "Invalid Playlist Id!" });
  if (!isValidObjectId(resId))
    return res.status(422).json({ error: "Invalid Audio Id!" });

  if (all == "yes") {
    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      owner: req.user.id,
    });
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
  }

  if (resId) {
    if (!isValidObjectId(resId))
      return res.status(422).json({ error: "Invalid Audio Id!" });
    const playlist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        owner: req.user.id,
      },
      {
        $pull: { items: resId },
      }
    );
    if (!playlist) return res.status(404).json({ error: "Playlist not found" });
  }

  res.json({ success: resId });
};

export const getPlaylistByProfile: RequestHandler = async (
  req: UpdatePLayListRequest,
  res
) => {
  const { pageNo = "0", limit = "20" } = req.query as {
    pageNo: string;
    limit: string;
  };
  const data = await Playlist.find({
    owner: req.user.id,
    visibility: {
      $ne: "auto",
    },
  })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit))
    .sort("-createdAt");

  const playlist = data.map((item) => {
    return {
      id: item._id,
      title: item.title,
      itrmCount: item.items.length,
      visibility: item.visibility,
    };
  });

  res.json({ playlist });
};

export const getAudios: RequestHandler = async (
  req: UpdatePLayListRequest,
  res
) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId))
    return res.status(422).json({ error: "Invalid Playlist Id!" });

  const playlist = await Playlist.findOne({
    owner: req.user.id,
    _id: playlistId,
  }).populate<{ items: PopulateFavList[] }>({
    path: "items",
    populate: { path: "owner", select: "name" },
  });

  if (!playlist) return res.json({ list: [] });
  const audios = playlist.items.map((item) => {
    return {
      id: item._id,
      title: item.title,
      category: item.category,
      file: item.file.url,
      poster: item.poster?.url,
      owner: {
        id: item.owner._id,
        name: item.owner.name,
      },
    };
  });

  res.json({
    list: {
      id: playlist._id,
      title: playlist.title,
      audios,
    },
  });
};
