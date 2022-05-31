import { Console } from "console";
import { IUser } from "../../../api/models/userModels";
import {
  IRegisterUserRequest,
  IAuthUserResponse,
  IAuthUserRequest,
} from "../../../api/models/userRestModels";
import {
  ConflictError,
  ForbiddenError,
  NotAcceptableError,
} from "../models/exceptions.models";

class UserService {
  public async registerUser(request: IRegisterUserRequest): Promise<IUser> {
    const response = await fetch(`/api/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    switch (response.status) {
      case 200:
        return await response.json();
      case 406:
        throw new NotAcceptableError();
      case 409:
        throw new ConflictError();
      default:
        console.log("Unknown status code " + response.status);
        throw new Error("Unknown status code " + response.status);
    }
    return await response.json();
  }

  public async authUser(request: IAuthUserRequest): Promise<IAuthUserResponse> {
    const response = await fetch(`/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    switch (response.status) {
      case 200:
        return await response.json();
      case 403:
        throw new ForbiddenError();
      default:
        console.log("Unknown status code " + response.status);
        throw new Error("Unknown status code " + response.status);
    }
  }
}

export default new UserService();
