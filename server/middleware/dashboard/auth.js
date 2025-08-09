 const dotenv = require("dotenv");
  const jwt = require("jsonwebtoken");
   const JWT_SECRET  = process.env.JWT_SECRET
     dotenv.config();

     const authMiddleware = (allowedRoles = []) => (req,res,next) => {
      const authHeader = req.headers.authorization;

      if(!authHeader) 
        return res.status(401).json({message: "No token, authorization denied"});

      const token = authHeader.split(" ")[1];

      try{
        const decoded = jwt.verify(token, JWT_SECRET);
        if(!allowedRoles.includes(decoded.role)){
          return res.status(403).json({message:"Access denied"})
        }
        req.user = decoded;
        next()
      }catch(err){
        res.status(401).json({message: "Invalid token"})
      }


     }

     module.exports = authMiddleware;