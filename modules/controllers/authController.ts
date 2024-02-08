import { Request, Response } from "express";
import passport from "passport";
import { getToken } from "./controller";

export const handleAuthentication = async (
  req: Request,
  res: Response,
) => {
  passport.authenticate(
    "local",
    {
      failureFlash: true,
    },
    async (ress: Response, user: any, err: Error) => {
      if (err) {
        return res.json({
          message: err.message,
          code: 401,
          success: false,
        });
      } else {
        try {
          const token = await getToken(user._id, user.role, user.phoneNumber);
          const newData = {
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            id: user._id,
            authenticated: true,
            wallet: user.wallet,
          };
          return res.json({
            data: newData,
            code: 200,
            success: true,
          });
        } catch (error) {
          return res.status(500).json({
            message: "خطایی رخ داده است لطفا مجددا تلاش نمایید",
            code: 500,
            success: false,
          });
        }
      }
    }
  )(req, res);
};
