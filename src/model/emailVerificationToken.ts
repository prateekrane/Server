import { Model, ObjectId, Schema, model } from "mongoose";
import { hash, compare } from "bcrypt";
interface EmailVerificationTokenDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}
interface Methods {
  compareToken(token: string): Promise<boolean>;
}
//expire them after 1hr

const emailVerificatoinTokenSchema = new Schema<
  EmailVerificationTokenDocument,
  {},
  Methods
>({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600, //60min * 60 sec=3600s
    default: Date.now(),
  },
});

emailVerificatoinTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }
  next();
});

emailVerificatoinTokenSchema.methods.compareToken = async function (token) {
  const result = await compare(token, this.token);
  return result;
};

export default model(
  "emailVerificationToken",
  emailVerificatoinTokenSchema
) as Model<EmailVerificationTokenDocument, {}, Methods>;