import { connect, disconnect } from "../config/db.config";
import { APILogger } from "../logger/api.logger";
import { ISchemaGroup, GroupModel } from "../repository/groupModel";
import {
  ISchemaGroupMember,
  GroupMemberModel,
} from "../repository/groupMemberModel";
import { IGroup } from "../models/groupModels";
import { IUser } from "../models/userModels";
import UserService from "./userService";
import { Types } from "mongoose";

class GroupService {
  private logger: APILogger;

  constructor() {
    connect();
    this.logger = new APILogger();
  }

  async getMyGroups(userId: string): Promise<IGroup[]> {
    return (
      await GroupModel.find({
        userId: userId,
      })
    ).map((x) => this.documentToInternal(x));
  }

  async getGroup(groupId: string): Promise<IGroup> {
    return this.documentToInternal(await GroupModel.findById(groupId));
  }

  async createGroup(groupName: string, userId: string): Promise<IGroup> {
    let group = await GroupModel.create({
      name: groupName,
      userId: userId,
      members: [userId],
    });
    await this.addGroupToUser(userId, group.id);
    return this.documentToInternal(group);
  }

  async getGroupMemberes(groupId: string): Promise<IUser[]> {
    let group: ISchemaGroup = await GroupModel.findOne({
      groupId: groupId,
    });
    if (group === null) {
      return null;
    }
    return await UserService.getUsersWithId(group.members);
  }

  async removeGroup(groupId: string) {
    let group: ISchemaGroup = await GroupModel.findOne({
      groupId: groupId,
    });
    if (group === null) {
      return false;
    }

    let promises: Promise<any>[] = [];
    for (let userId of group.members) {
      promises.push(this.removeGroupFromUser(userId, groupId));
    }

    await GroupModel.deleteOne({ _id: groupId });
    await Promise.all(promises);
  }

  async addUserToGroup(userId: string, groupId: string) {
    let group: ISchemaGroup = await GroupModel.findOne({
      groupId: groupId,
    });
    if (
      group === null ||
      (group.members !== null && group.members.includes(userId))
    ) {
      return false;
    }
    group.members.push(userId);
    let groupPromise = group.save();

    let memberPromise = this.addGroupToUser(userId, groupId);

    return Promise.all([groupPromise, memberPromise]);
  }

  async removeUserFromGroup(userId: string, groupId: string) {
    let group: ISchemaGroup = await GroupModel.findOne({
      groupId: groupId,
    });
    if (
      group === null ||
      (group.members !== null && group.members.includes(userId))
    ) {
      return false;
    }
    group.members = group.members.filter(function (value) {
      return value != userId;
    });
    let groupPromise = group.save();
    let memberPromise = this.removeGroupFromUser(userId, groupId);

    return Promise.all([groupPromise, memberPromise]);
  }

  private async addGroupToUser(userId: string, groupId: string): Promise<void> {
    let groupMember: ISchemaGroupMember = await GroupMemberModel.findOne({
      userId: userId,
    });
    groupMember.groupIds.push(groupId);
    await groupMember.save();
  }

  private async removeGroupFromUser(
    userId: string,
    groupId: string
  ): Promise<void> {
    let groupMember: ISchemaGroupMember = await GroupMemberModel.findOne({
      userId: userId,
    });
    groupMember.groupIds = groupMember.groupIds.filter(function (value) {
      return value != groupId;
    });
    await groupMember.save();
  }

  documentToInternal(groupDocument: ISchemaGroup): IGroup {
    if (groupDocument === null) {
      return null;
    }
    return {
      groupId: groupDocument._id,
      userId: groupDocument.userId,
      name: groupDocument.name,
      createDate: groupDocument.createDate,
      members: groupDocument.members.length,
    };
  }
}

export default new GroupService();
