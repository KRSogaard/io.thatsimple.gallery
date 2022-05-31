import { APILogger } from "../logger/api.logger";
import GroupService from "../service/groupService";
import { IUser } from "../models/userModels";
import { ICreateGroupRequest } from "../models/groupRestModels";
import { IGroup } from "../models/groupModels";

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
}
