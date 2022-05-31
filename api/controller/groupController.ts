import { APILogger } from "../logger/api.logger";
import GroupService from "../service/groupService";
import { IUser } from "../models/userModels";
import { ICreateGroupRequest } from "../models/groupRestModels";
import { IGroup } from "../models/groupModels";
import { ForbiddenError, NotFoundError } from "../models/exceptionModels";

export class GroupController {
  private logger: APILogger;

  constructor() {
    this.logger = new APILogger();
  }

  async createGroup(
    authUser: IUser,
    model: ICreateGroupRequest
  ): Promise<IGroup> {
    return await GroupService.createGroup(model.name, authUser.userId);
  }

  async getGroup(authUser: IUser, groupId: string): Promise<IGroup> {
    if (!(await GroupService.canUserViewGroup(groupId, authUser.userId))) {
      throw new NotFoundError();
    }
    return await GroupService.getGroup(groupId);
  }

  async getGroupMembers(authUser: IUser, groupId: string): Promise<IUser[]> {
    if (!(await GroupService.canUserViewGroup(groupId, authUser.userId))) {
      throw new NotFoundError();
    }
    return await GroupService.getGroupMemberes(groupId);
  }

  async deleteGroup(authUser: IUser, groupId: string): Promise<void> {
    let group = await GroupService.getGroup(groupId);
    if (group === null) {
      throw new NotFoundError();
    }
    if (group.userId != authUser.userId) {
      throw new ForbiddenError();
    }
    await GroupService.removeGroup(groupId);
  }

  async getMyGroups(authUser: IUser): Promise<IGroup[]> {
    return await GroupService.getMyGroups(authUser.userId);
  }
}
