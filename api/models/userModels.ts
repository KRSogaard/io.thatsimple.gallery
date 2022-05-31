export interface IUser {
  userId: string;
  username: string;
  createDate: Date;
}
export interface IInternalUser {
  userid?: string;
  username: string;
  email: string;
  password: string;
  passwordSalt: string;
  createDate: Date;
}
