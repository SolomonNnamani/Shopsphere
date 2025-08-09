const dotenv = require("dotenv");
dotenv.config();

const passport = require("passport");
const jwt = require("jsonwebtoken");
const googleUrl =  process.env.GOOGLE_CALLBACK_URL_PROD || process.env.GOOGLE_CALLBACK_URL_LOCAL


const google = (app) => {
  //step 1: Start Google login

  app.get(
    "/auth/google", (req, res, next)=> {
      const origin = req.query.origin || "sign-up"
    passport.authenticate("google", {
      scope: ["profile", "email"],
      prompt: "select_account", // 👈 force account selection every time
      state:origin, //store it
      
    })(req,res,next)
  });

  //Step 2: Handle callback
  app.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", { session: false }, (err, user) => {
      if (err || !user) {
        const errorMsg = encodeURIComponent(
          err.message || "Google login failed"
        );
        return res.redirect(`http://localhost:5173/register?error=${errorMsg}`);
      }




    const isProfileComplete = user.profileComplete
      const origin = req.query.state || "sign-up"
      if( isProfileComplete){
 //User completed profile, issue a longer-term token
        const sessionPayload =  {
          name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        id: user._id,
          type:"session",
        }
        const sessionToken = jwt.sign(sessionPayload, process.env.JWT_SECRET,{
          expiresIn: "2hr"
        })
         return res.redirect(`${googleUrl}/sign-in?token=${sessionToken}&type=session`);
}


       // For new user or signup (or returning user who hasn’t completed profile)
 const onboardingPayload = {
     
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        id: user._id,
        type:"onboarding"
      };
      const onboardingToken = jwt.sign(onboardingPayload, process.env.JWT_SECRET, {
        expiresIn: "30m", //onBoarding token
      });

        //still in onBoarding stage
         res.redirect(`${googleUrl}/sign-up?token=${onboardingToken}&type=onboarding`)




        
       
     
     
    })(req, res, next);
  });
};
module.exports = google;
