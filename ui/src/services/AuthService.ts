import { IAuthUserResponse } from "../../../api/models/userRestModels";
import UserService from "./UserService";

class Auth {
  isAuthenticated(): boolean {
    const authToken = this.getLocalStorage();
    return authToken != null;
  }

  getLocalStorage(): AuthStorage | null {
    let storageString = localStorage.getItem("auth");
    if (storageString === null) {
      storageString = sessionStorage.getItem("auth");
    }
    if (storageString === null) {
      return null;
    }
    return JSON.parse(storageString);
  }

  async login(
    username: string,
    password: string,
    rememberMe: boolean
  ): Promise<boolean> {
    try {
      var authResult: IAuthUserResponse = await UserService.authUser({
        username: username,
        password: password,
      });

      let storage;
      if (rememberMe) {
        storage = localStorage;
      } else {
        storage = sessionStorage;
        // We we had logged in before clear what user token we may had stored in local storage
        localStorage.clear();
      }

      let storageObj: AuthStorage = {
        authToken: authResult.token,
        userId: authResult.userId,
        username: authResult.username,
      };
      storage.setItem("auth", JSON.stringify(storageObj));

      return true;
    } catch (err) {
      return false;
    }
  }

  signOut() {
    localStorage.clear();
    sessionStorage.clear();
  }
}

export default new Auth();

interface AuthStorage {
  authToken: string;
  userId: string;
  username: string;
}
