const dotenv = require("dotenv")
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
dotenv.config();


		const authMiddleware = (req,res,next) => {
	const authHeader = req.headers.authorization;
	//console.log(authHeader)

	if(!authHeader) return res.status(401).json({message:"No token, authorization denied"});

	const token = authHeader.split(" ")[1];
	try{
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		req.user = decoded //make user info avaliable on the specify routes
		next()
	}catch(err){
		res.status(401).json({message: "Token is invalid or expired"})
	}


}

module.exports = authMiddleware