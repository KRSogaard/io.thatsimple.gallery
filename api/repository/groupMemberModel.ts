import { model, Schema, Model, Document, Types } from "mongoose";

export interface ISchemaGroupMember extends Document {
  _id: string;
  userId: string;
  groupIds: string[];
}

const GroupMemberSchema: Schema = new Schema({
  userId: { type: String, required: true },
  groupIds: { type: [String], required: true },
});

export const GroupMemberModel: Model<ISchemaGroupMember> =
  model<ISchemaGroupMember>("groupMembers", GroupMemberSchema);
