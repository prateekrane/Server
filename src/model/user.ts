import { compare, hash } from "bcrypt";
import { Model, ObjectId, Schema, model } from "mongoose";

export interface UserDocument {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  verification: boolean;
  avtar?: { uri: string; publicID: string };
  tokens: string[];
  favId: ObjectId[];
  followers: ObjectId[];
  following: ObjectId[];
}
interface Methods {
  comparePassword(password: string): Promise<boolean>;
}
const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avtar: {
      type: Object,
      uri: String,
      publicID: String,
    },
    verification: {
      type: Boolean,
      default: false,
    },
    favId: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tokens: [String],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const result = await compare(password, this.password);
  return result;
};

export default model("User", userSchema) as Model<UserDocument, {}, Methods>;
