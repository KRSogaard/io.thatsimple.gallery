import { model, Schema, Model, Document } from "mongoose";

export interface ISchemaUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  passwordSalt: string;
  createDate: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  passwordSalt: { type: String, required: true },
  createDate: { type: Date, default: Date.now },
});

export const UserModel: Model<ISchemaUser> = model<ISchemaUser>(
  "users",
  UserSchema
);
