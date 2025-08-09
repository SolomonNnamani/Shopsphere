const guestLogin = (app) => {
  const dotenv = require("dotenv");
  const jwt = require("jsonwebtoken");
  const JWT_SECRET = process.env.JWT_SECRET;
  dotenv.config();

  app.post("/api/dashboard/auth/guest", async (req, res) => {
    try {
      // No DB check needed. We're just giving a read-only token.
      const token = jwt.sign({ role: "viewer" }, JWT_SECRET, {
        expiresIn: "1d",
      });
      res.status(200).json({
        token,
        user: { 
          name: "Guest Viewer", 
          role: "viewer",
          createdAt: "null"

           },
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Error logging in as guest" });
    }
  });
};
module.exports = guestLogin;
