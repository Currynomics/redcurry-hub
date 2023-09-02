import payload from "payload";
import Strategy from "passport-google-oauth20";
import { v4 as uuidv4 } from "uuid";
import { Forbidden, LockedAuth } from "payload/errors";
var GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;
var TwoFAStartegy = require('passport-2fa-totp').Strategy;

require("dotenv").config();

const MFAStrategy = new Strategy(
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
        user.collection = "users";
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

export default MFAStrategy;



// passport.use(new TwoFAStartegy(function (username, password, done) {
//     // 1st step verification: username and password

//     User.findOne({ username: username }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         if (!user.verifyPassword(password)) { return done(null, false); }
//         return done(null, user);
//     });
// }, function (user, done) {
//     // 2nd step verification: TOTP code from Google Authenticator

//     if (!user.secret) {
//         done(new Error("Google Authenticator is not setup yet."));
//     } else {
//         // Google Authenticator uses 30 seconds key period
//         // https://github.com/google/google-authenticator/wiki/Key-Uri-Format

//         var secret = GoogleAuthenticator.decodeSecret(user.secret);
//         done(null, secret, 30);
//     }
// }));