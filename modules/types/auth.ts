import { Types } from "mongoose";

export type RegisterTypes = {
  phoneNumber: string;
  password: string;
  firstName: string;
  lastName: string;
  email?: string;
  address?: string;
  id?: Types.ObjectId;
};
