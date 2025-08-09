const dashboardLogin = (app) => {
 const dotenv = require("dotenv");
  const jwt = require("jsonwebtoken");
  const bcrypt = require("bcrypt");
  const JWT_SECRET  = process.env.JWT_SECRET
  const {DashboardUser} = require("../../../model/user")
    dotenv.config();

	app.post("/api/dashboard/auth/login", async(req,res)=> {
		const {email, password} = req.body;
		try{
			const user = await DashboardUser.findOne({email})
			

			if(!user) return res.status(404).json({error:"User not found"});
			if(user.role !== 'admin') return res.status(403).json({error:"Not authorized"});

			const isMatch = await bcrypt.compare(password, user.password);
			if(!isMatch) return res.status(401).json({error: "Invalid password"})

				const token = jwt.sign({id: user._id, role:user.role}, JWT_SECRET, {
					expiresIn: "1d",
				})

			res.status(200).json({
				token, 
				message:"Logged in as admin",
				user:{
					name:user.name,
					role:user.role,
					email:user.email,
					createdAt:user.createdAt,
				}

			})


		}catch(error){
			console.log("Error Logging in", error);
      res
        .status(500)
        .json({ error: "Failed to login user. Please try again later" })
		}
	})

}

module.exports = dashboardLogin