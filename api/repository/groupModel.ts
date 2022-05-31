import { model, Schema, Model, Document, Types } from "mongoose";

export interface ISchemaGroup extends Document {
  _id: string;
  name: string;
  userId: string;
  members: string[];
  createDate: Date;
}

const GroupSchema: Schema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  members: { type: [String], required: true },
  createDate: { type: Date, default: Date.now },
});

export const GroupModel: Model<ISchemaGroup> = model<ISchemaGroup>(
  "groups",
  GroupSchema
);
