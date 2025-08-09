const dotenv = require("dotenv");
dotenv.config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../model/user"); // import your user model
const createNotification = require("./notificationUtil.js")

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL_PROD || process.env.GOOGLE_CALLBACK_URL_LOCAL,

    },
    async (accessToken, refreshToken, profile, done) => {
      try {
           console.log("Using callback URL:", process.env.GOOGLE_CALLBACK_URL);
       
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email returned from Google"), null);
        }
        const existingUser = await User.findOne({ email });

        if (existingUser) {
          // Check if user exists but registered with a different method
          if (existingUser.provider !== "google") {
            return done(
              new Error(
                "This email is already registered using another method"
              ),
              null
            );
          }
          // User already registered with Google, log them in
          console.log("Exiting Google user found, logging in");
          return done(null, existingUser);
        }

        console.log("Creating new google user");
        const newUser = new User({
          firstName: profile.name.givenName || "Google",
          lastName: profile.name.familyName || "User",
          email,
          phone:"",
          provider: "google",
          profileComplete:false,
        });
        await newUser.save();

        await createNotification({
          type: "new_customer",
          message: `New Google user ${profile.name.givenName} ${profile.name.familyName} just registered `,
          relatedId:newUser._id,
          relatedModel: "User"
        })

        done(null, newUser);
      } catch (err) {
        console.error("Google auth error:", err);
        done(err, null);
      }
    }
  )
);
