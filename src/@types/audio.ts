import { Request } from "express";
import { AudioDocument } from "../model/audio";
import { ObjectId } from "mongoose";

export type PopulateFavList = AudioDocument<{ _id: ObjectId; name: string }>;

export interface createPLayListRequest extends Request {
  body: {
    title: string;
    resId: string;
    visibility: "public" | "private";
  };
}

export interface UpdatePLayListRequest extends Request {
  body: {
    title: string;
    id: string;
    item: string;
    visibility: "public" | "private";
  };
}
