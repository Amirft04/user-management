import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../configs/configs"; // Adjust the path to your config file
import { User, IUser } from "../models/user";

export const authenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["x-access-token"] as string | undefined;

  if (!token) {
    return res.status(401).json({
      message: "برای مشاهده این بخش باید وارد حساب کاربری خود شوید",
      success: false,
      code: 401,
    });
  }

  try {
    const decode: any = await jwt.verify(token, config.secret);
    const userId = decode.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        message: "برای مشاهده این بخش باید وارد حساب کاربری خود شوید",
        success: false,
        code: 401,
      });
    }
    req.user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      message: "برای مشاهده این بخش باید وارد حساب کاربری خود شوید",
      success: false,
      code: 401,
    });
  }
};

export const authenticatedAdmin = (
  req: Request & { user: IUser },
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated() && req.user.role == "admin") {
    return next();
  }
  return res.json({
    message: "سطح دسترسی شما برای این بخش مجاز نیست",
    suceess: false,
    code: 101,
  });
};
