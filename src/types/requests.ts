import { Request } from "express"

export interface PostRequest<T> extends Request {
  body: T
}

export interface GetAuthRequest<T> extends Request {
  session: T
}