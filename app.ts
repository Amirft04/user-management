import express, { Request, Response } from "express";
import configs from "./modules/configs/configs";
import session from "express-session";
import bodyParser from "body-parser";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MongoStore from "connect-mongo";
import cors from "cors";
import useragent from "express-useragent";
import connectDB from "./modules/configs/DB";
import { User } from "./modules/models/user";
import bcrypt from "bcryptjs";
import webRouter from "./modules/routes/api/web";

connectDB();

//*passport configuration
require("./modules/configs/passport");

const allowlist = ["http://localhost", "http://localhost:3000"];

const corsOptionsDelegate = (
  req: express.Request,
  callback: (err: Error | null, options?: cors.CorsOptions) => void
) => {
  let corsOptions: cors.CorsOptions;
  if (allowlist.indexOf(req.header("Origin")!) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }

  callback(null, corsOptions); // callback expects two parameters: error and options
};

const app = express();

app.use(useragent.express());
app.use(cors(corsOptionsDelegate));
app.use(bodyParser.urlencoded({ extended: false, limit: "5mb" }));
app.use(bodyParser.json({ type: "application/json", limit: "50mb" }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: configs.connectionString,
    }),
  })
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "phoneNumber", // Set the username field to 'phoneNumber'
      passwordField: "password", // Assuming you have a password field
    },
    async (phoneNumber, password, done) => {
      try {
        // Find the user by phoneNumber number
        const user = await User.findOne({ phoneNumber });

        // If the user doesn't exist or the password is incorrect, return failure
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return done(null, false, {
            message: "نام کاربری یا رمز عبور اشتباه است",
          });
        }
        // If the user is found and the password is correct, return success
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static(__dirname + "/uploads"));
app.use("/content", express.static(__dirname + "/content"));
app.use("/public", express.static(__dirname + "/public"));

app.use("/web", webRouter);

app.use((req: Request, res: Response) => {
  res.json({
    message: "NOT FOUND",
    code: 401,
  });
});

app.listen(configs.port, () => {
  console.log("listening on *: " + configs.port);
});
