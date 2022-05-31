import { model, Schema, Model, Document } from "mongoose";

export interface ISchemaUserToken extends Document {
  userId: string;
  token: string;
  createDate: Date;
}

const UserTokenSchema: Schema = new Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  createDate: { type: Date, default: Date.now },
});

export const UserTokenModel: Model<ISchemaUserToken> = model<ISchemaUserToken>(
  "user-tokens",
  UserTokenSchema
);
