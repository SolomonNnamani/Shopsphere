const phone = (app) => {
	const {User} = require("../../../model/user");
	const jwt = require('jsonwebtoken')
	const onboardingMiddleware  = require("../../../middleware/mainSite/onboardingMiddleware.js")
	const dotenv = require('dotenv')
	
	dotenv.config()



	app.put('/auth/tel-phone', onboardingMiddleware, async(req,res)=> {
		const {phone} = req.body;
		   if (!phone ) {
      return res.status(400).json({ error: "Phone number is required" });
    }


		try{
			const user = await User.findById(req.user.id); //Get user

			if(!user){
				return res.status(404).json({error: "User not found, could not be updated"})
			}


			// ❌ Stop update if profile already complete
      if (user.profileComplete) {
        return res
          .status(400)
          .json({ error: "Profile already complete. Cannot modify phone number." });
      }

  // ✅ Proceed to update phone and complete profile
      user.phone = phone;
      user.profileComplete = true;
      await user.save();


      //after updating the user:  Create session token
      const sessionPayload = {
      	name:user.name,
      	email:user.email,
      	id:user._id,
      	type:"session",
      }

      const sessionToken = jwt.sign(sessionPayload, process.env.JWT_SECRET, {
      	expiresIn: "1hr"
      })
			
			res.status(200).json({
				user,
				token:sessionToken,
				 message:"Phone number registered successfully"})

		}catch(error){
			console.log('Error updating number: ', error);
			res.status(500).json({error: "Cannot save this information right now, please try again later" })
		}


	})





}

module.exports = phone