export interface IRegisterUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface IAuthUserRequest {
  username: string;
  password: string;
}
export interface IAuthUserResponse {
  token: string;
  userId: string;
  username: string;
}
