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
      if (authToken === null || authToken === "") {
        res.status(403);
        res.send();
        return;
      }
      let userCheck = await UserService.getUserByToken(authToken.trim());
      if (userCheck === null) {
        res.status(403);
        res.send();
        return;
      }
      console.log("User identified as ", userCheck);

      // Setting user to the request
      (req as any).authUser = userCheck;
      next();
    });
    this.express.get("/api/users", (req, res) => {
      this.userController.getUsers().then((data) => res.json(data));
    });
    this.express.post("/api/group", (req, res) => {
      this.groupController
        .createGroup((req as any).authUser, req.body)
        .then((data) => res.json(data));
    });
    // handle undefined routes
    // this.express.use("*", (req, res, next) => {
    //     res.send("Make sure url is correct!!!");
    // });
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
