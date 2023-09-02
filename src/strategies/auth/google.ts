import payload from "payload";
import Strategy from "passport-google-oauth20";
import { v4 as uuidv4 } from "uuid";
import { Forbidden, LockedAuth } from "payload/errors";

require("dotenv").config();

const GoogleStrategy = new Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/users/google/callback",
    scope: ["profile", "email"],
  },
  async (accessToken, refreshToken, profile, done) => {
    const { emails } = profile;
    const email = emails[0]?.value;

    if (!email) {
      done(Forbidden, false);
    }

    try {
      let user = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (user?.totalDocs > 0) {
        user = user.docs[0];
      }

      const isLocked = (date) => !!(date && date > Date.now());
      // @ts-ignore:
      if (user && isLocked(user.lockUntil)) {
        throw new LockedAuth();
      }

      if (user?.totalDocs < 1) {
        user = await payload.create({
          collection: "users",
          data: {
            email,
            password: uuidv4(),
            avatar: "1",
            _verified: true,
          },
          disableVerificationEmail: true,
        });
      }

      if (user) {
        // @ts-ignore
        user.collection = "users";
        // @ts-ignore
        user._strategy = "google";
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (e) {
      done(e, false);
    }
  }
);

export default GoogleStrategy;
