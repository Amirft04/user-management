import * as express from "express";
import * as authController from "../../../controllers/authController";
import { Request, Response } from "express";

const router = express.Router();

router.post("/login", (req: Request, res: Response) =>
  authController.handleAuthentication(req, res)
);

export default router;
