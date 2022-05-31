import { connect, disconnect } from "../config/db.config";
import { IInternalUser, IUser } from "../models/userModels";
import { IRegisterUserRequest } from "../models/userRestModels";
import { APILogger } from "../logger/api.logger";
import { ISchemaUser, UserModel } from "../repository/userModel";
import { ISchemaUserToken, UserTokenModel } from "../repository/userTokenModel";
import { Types } from "mongoose";
import crypto = require("crypto");

class UserService {
  private logger: APILogger;

  constructor() {
    connect();
    this.logger = new APILogger();
  }

  async getUsers(): Promise<IUser[]> {
    return (await UserModel.find({})).map((x) => this.documentToUser(x));
  }
  async getUsersWithId(userIds: string[]): Promise<IUser[]> {
    return (await UserModel.find().where("_id").in(userIds).exec()).map((x) =>
      this.documentToUser(x)
    );
  }

  async registerUser(registerUser: IRegisterUserRequest) {
    var passwordSalt: string = this.randomString(10).toString();
    var password = this.hashPassword(registerUser.password, passwordSalt);
    var user: IInternalUser = {
      username: registerUser.username,
      email: registerUser.email,
      password: password,
      passwordSalt: passwordSalt,
      createDate: new Date(),
    };
    return this.documentToUser(await UserModel.create(user));
  }

  async verifyCanRegister(
    registerUser: IRegisterUserRequest
  ): Promise<boolean> {
    var emailCheck: ISchemaUser = await UserModel.findOne({
      email: registerUser.email,
    });

    if (emailCheck != null) {
      return false;
    }
    return true;
  }

  async verifyAuth(email: string, password: string): Promise<boolean> {
    var user = await UserModel.findOne({
      email: email,
    });
    if (user == null) {
      return false;
    }

    var loginHash = this.hashPassword(password, user.passwordSalt);
    if (loginHash === user.password) {
      return true;
    }
    return false;
  }

  async getUserByLogin(email: string): Promise<IUser> {
    var user = await UserModel.findOne({
      email: email,
    });
    return this.documentToUser(user);
  }

  async createAuthToken(userId: string): Promise<string> {
    let token = this.randomString(32);
    await UserTokenModel.create({
      userId: userId,
      token: token,
    });
    return token;
  }

  async getUserByToken(token: string): Promise<IUser | null> {
    var tokenObj = await UserTokenModel.findOne({
      token: token,
    });
    if (tokenObj === null) {
      return null;
    }
    var user = await UserModel.findById(tokenObj.userId);
    if (user === null) {
      return null;
    }
    return this.documentToUser(user);
  }

  documentToUser(user: ISchemaUser): IUser {
    return {
      userId: user._id,
      username: user.username,
      createDate: user.createDate,
    };
  }

  hashPassword(password: string, passwordSalt: string) {
    return crypto
      .createHash("sha256")
      .update(password + "" + passwordSalt)
      .digest("hex");
  }

  randomString(length): string {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.!@#$%^&*()";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

export default new UserService();
