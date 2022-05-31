import * as bodyParser from "body-parser";
const path = require("path");
import * as express from "express";
import { APILogger } from "./logger/api.logger";
import { UserController } from "./controller/userController";
import { GroupController } from "./controller/groupController";
//import swaggerUi = require("swagger-ui-express");
import fs = require("fs");
import {
  ConflictError,
  ForbiddenError,
  NotAcceptableError,
} from "./models/exceptionModels";
import UserService from "./service/userService";

class App {
  public express: express.Application;
  public logger: APILogger;
  public userController: UserController;
  public groupController: GroupController;

  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
    this.errorHandeling();
    this.logger = new APILogger();
    this.userController = new UserController();
    this.groupController = new GroupController();
  }

  private middleware(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(express.static(path.join(__dirname, "../ui/build")));
  }

  private routes(): void {
    // Public APIS
    this.express.post("/api/auth", (req, res, next) => {
      console.log("auth user: /api/auth");
      this.userController.authUser(req.body).then(
        (data) => res.json(data),
        (err) => {
          console.log("Caught error when authing user:: ", err);
          next(err);
        }
      );
    });
    this.express.get("/", (req, res, next) => {
      res.sendFile(path.join(__dirname, "../ui/build/index.html"));
    });
    this.express.post("/api/user", (req, res, next) => {
      console.log("Create Users: /api/users");
      this.userController.registerUser(req.body).then(
        (data) => res.json(data),
        (err) => {
          console.log("Caught error when authing user:: ", err);
          next(err);
        }
      );
    });

    this.express.all("*", async (req, res, next) => {
      let authToken = req.header("auth");
      console.log('Authentication user based on token"' + authToken + '"');
      if (authToken === null || authToken === "" || authToken === undefined) {
        console.log("Auth failed, no token provided");
        res.status(403);
        res.send();
        return;
      }
      let userCheck = await UserService.getUserByToken(authToken.trim());
      if (userCheck === null) {
        console.log("Auth failed, no user found with token");
        res.status(403);
        res.send();
        return;
      }
      console.log("User identified as ", userCheck);

      // Setting user to the request
      (req as any).authUser = userCheck;
      next();
    });
    this.express.get("/api/users", (req, res, next) => {
      console.log("Get Users: /api/users");
      this.userController.getUsers().then(
        (data) => res.json(data),
        (err) => {
          next(err);
        }
      );
    });
    this.express.post("/api/group", (req, res, next) => {
      console.log("Create Group: /api/group");
      this.groupController.createGroup((req as any).authUser, req.body).then(
        (data) => res.json(data),
        (err) => {
          next(err);
        }
      );
    });
    this.express.get("/api/user/groups", (req, res, next) => {
      console.log("Get my groups: /api/user/groups");
      this.groupController.getMyGroups((req as any).authUser).then(
        (data) => res.json(data),
        (err) => {
          next(err);
        }
      );
    });
    this.express.get("/api/group/:id", (req, res, next) => {
      console.log("Get Group: /api/group/" + req.params.id + "");
      if (!req.params.id) {
        next(new NotAcceptableError());
        return;
      }
      if (req.params.id.toLowerCase().trim() === "my") {
        console.log("This is a my request");
        next();
        return;
      }
      this.groupController.getGroup((req as any).authUser, req.params.id).then(
        (data) => res.json(data),
        (err) => {
          next(err);
        }
      );
    });
    this.express.delete("/api/group/:id", (req, res, next) => {
      if (req.params.id.toLowerCase().trim() === "my") {
        console.log("This is a my request");
        next(new NotAcceptableError());
        return;
      }
      console.log("/api/group/" + req.params.id + "");
      this.groupController
        .deleteGroup((req as any).authUser, req.params.id)
        .then(
          (data) => res.json(data),
          (err) => {
            next(err);
          }
        );
    });
    this.express.get("/api/group/:id/members", (req, res, next) => {
      console.log("/api/group/" + req.params.id + "/members");
      this.groupController
        .getGroupMembers((req as any).authUser, req.params.id)
        .then(
          (data) => res.json(data),
          (err) => {
            next(err);
          }
        );
    });
  }

  private errorHandeling(): void {
    this.express.use((error, req, res, next) => {
      if (error instanceof ConflictError) {
        res.status(409);
        res.send();
        return;
      } else if (error instanceof NotAcceptableError) {
        res.status(406);
        res.send();
        return;
      } else if (error instanceof ForbiddenError) {
        res.status(403);
        res.send();
        return;
      } else {
        console.log("Unknown error was thrown:: ", error);
        console.log("Path: ", req.path);
        res.status(500);
        res.send();
        return;
      }
    });
  }
}

export default new App().express;
