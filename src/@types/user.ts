import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: any;
        name: string;
        email: string;
        verified: boolean;
        avatar: any;
        followers: any;
        following: number;
      };
      token: string;
    }
  }
}

export interface CreateUser extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}
export interface VerifyEmailRequest extends Request {
  body: {
    userId: string;
    token: string;
  };
}
