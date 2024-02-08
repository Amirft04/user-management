import * as express from "express";
import * as userController from "../../../controllers/userController";
import { Request, Response, NextFunction } from "express";
import { authenticated } from "../../../middlewares/auth";

const router = express.Router();

router.post(
  "/register",
  (req: Request, res: Response, next: NextFunction) =>
    userController.vRegister(req, res, next),
  (req: Request, res: Response) => userController.register(req, res)
);

router.post(
  "/updateuser",
  authenticated,
  (req: Request, res: Response, next: NextFunction) =>
    userController.vUpdateUser(req, res, next),
  (req: Request, res: Response) => userController.updateUser(req, res)
);

router.get("/getuserbyid", authenticated, (req: Request, res: Response) =>
  userController.getUserById(req, res)
);

router.get("/getusers", authenticated, (req: Request, res: Response) =>
  userController.getUsers(req, res)
);

router.get("/getuserspage", authenticated, (req: Request, res: Response) =>
  userController.getUsersPage(req, res)
);

router.post("/deleteuser", authenticated, (req: Request, res: Response) =>
  userController.deleteUser(req, res)
);

router.post(
  "/sendphoneactivationcode",
  authenticated,
  (req: Request, res: Response) =>
    userController.sendPhoneActivationCode(req, res)
);

router.post("/phoneactivation", authenticated, (req: Request, res: Response) =>
  userController.phoneActivation(req, res)
);

router.post(
  "/sendemailactivationcode",
  authenticated,
  (req: Request, res: Response) =>
    userController.sendEmailActivationCode(req, res)
);

router.post("/emailactivation", authenticated, (req: Request, res: Response) =>
  userController.emailActivation(req, res)
);

router.post("/requestpasswordreset", (req: Request, res: Response) =>
  userController.requestPasswordReset(req, res)
);

router.post("/resetpassword", (req: Request, res: Response) =>
  userController.resetPassword(req, res)
);

export default router;
