import { APILogger } from "../logger/api.logger";
import UserService from "../service/userService";
import { IUser } from "../models/userModels";
import {
  IRegisterUserRequest,
  IAuthUserRequest,
  IAuthUserResponse,
} from "../models/userRestModels";
import { ConflictError, ForbiddenError } from "../models/exceptionModels";

export class UserController {
  private logger: APILogger;

  constructor() {
    this.logger = new APILogger();
  }

  async getUsers(): Promise<IUser[]> {
    this.logger.info("Controller: getUsers", null);
    return await UserService.getUsers();
  }

  async registerUser(user: IRegisterUserRequest): Promise<IUser> {
    this.logger.info("Controller: registerUser", null);

    if (!(await UserService.verifyCanRegister(user))) {
      throw new ConflictError();
    }

    return await UserService.registerUser(user);
  }

  async authUser(auth: IAuthUserRequest): Promise<IAuthUserResponse> {
    this.logger.info("Controller: authUser", null);
    if (!(await UserService.verifyAuth(auth.username, auth.password))) {
      throw new ForbiddenError();
    }

    var user = await UserService.getUserByLogin(auth.username);
    var token = await UserService.createAuthToken(user.userId);

    return {
      userId: user.userId,
      username: user.username,
      token: token,
    };
  }
}
