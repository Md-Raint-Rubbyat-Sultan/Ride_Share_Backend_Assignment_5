import passport from "passport";
import { Strategy as localStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";
import bcrypt from "bcryptjs";

passport.use(
  new localStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done) => {
      const isUserExist = await User.findOne({ email });

      if (!isUserExist) {
        return done("User does not exist. Please register.");
      }

      if (
        isUserExist.isActive === IsActive.BLOCKED ||
        isUserExist.isActive === IsActive.INACTIVE
      ) {
        return done(`Filed to login. User is ${isUserExist.isActive}`);
      }

      if (isUserExist.isDeleted) {
        return done("User is deleted. Please contact with our team.");
      }

      if (!isUserExist.isVerified) {
        return done("Please verify your email address.");
      }

      const userAuthenticated = isUserExist.auth.some(
        (provider) => provider.provider === "google"
      );

      if (userAuthenticated && !isUserExist.password) {
        return done(
          "You are already authenticaed with Google. Please login with google and set a password from your profile if email password login needed."
        );
      }

      const isPasswordMatched = await bcrypt.compare(
        password,
        isUserExist.password as string
      );

      if (!isPasswordMatched) {
        return done("Incorrect Password.");
      }

      return done(null, isUserExist);
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(
  async (
    id: unknown,
    done: (err: any, user?: Express.User | false | null) => void
  ) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      console.log(error);
      done(error);
    }
  }
);
