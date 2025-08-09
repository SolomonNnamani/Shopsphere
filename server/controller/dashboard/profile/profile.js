const profile = (app) => {
	const { Profile } = require("../../../model/user.js");
	const authMiddleware = require("../../../middleware/dashboard/auth.js")

	app.put('/api/dashboard/profile', authMiddleware(["admin"]), async(req,res)=> {
		const {profilePicture} = req.body

		try{
			const updatedProfile = await Profile.findOneAndUpdate(
			{},
			{
				profilePicture,
			},
			{
				new:true,
				upsert:true
			}
				)
			res.status(200).json(updatedProfile)





		}catch(error){
			console.log("Error updating the profile", error)
			res.status(500).json({error:"Couldn't update profile, please try again later" })
		}


	})


	app.get('/api/dashboard/profile', authMiddleware(["admin", "viewer"]), async(req,res)=> {
		

		try{
			const picture = await Profile.findOne()
			
	
			res.status(200).json(picture)





		}catch(error){
			 console.log("Error fetching products: ", error);
      res.status(500).json({ error: "Failed to fetch products, Please try again!" });
    }
		


	})




}
module.exports = profile

