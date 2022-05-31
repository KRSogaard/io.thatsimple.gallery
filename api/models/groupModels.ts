import { IUser } from "./userModels";

export interface IGroup {
  groupId: string;
  userId: string;
  name: string;
  createDate: Date;
  members: number;
}
