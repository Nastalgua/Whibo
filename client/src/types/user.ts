export interface IUser {
  username: string,
  id: string,
  createdAt: Date,
  email: string,
  googleId: string
}

export type SocketUser = {
  username: string;
  uid: string;
  socketId: string;
}