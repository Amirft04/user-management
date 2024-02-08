import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcryptjs";

import { User } from "../models/user"; // Adjust the path based on your project structure

passport.use(
  new Strategy(async (phoneNumber: string, password: string, done: any) => {
    try {
      let user: any | null = await User.findOne({
        phoneNumber,
        isDeleted: { $ne: true },
      });
      if (!user) {
        return done(null, false, {
          message: "نام کاربری یا رمزعبور صحیح نیست",
        });
      }
      const isMatch: boolean = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, {
          message: "نام کاربری یا رمزعبور صحیح نیست",
        });
      }
    } catch (err) {
      console.log(err);
      done(err);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser((id: string, done) => {
  User.findById(id, (err: any, user: any) => {
    done(err, user);
  });
});
