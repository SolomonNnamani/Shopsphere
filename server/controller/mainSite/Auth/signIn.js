const signIn = (app) => {
  const {User} = require("../../../model/user");
  const dotenv = require("dotenv");
  dotenv.config();
  const jwt = require("jsonwebtoken");
  const bcrypt = require("bcrypt");

  app.post("/auth/sign-in", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "User not found" });

      if (user) {
        if (user.provider === "google") {
          return res.status(400).json({
            exist: "This email is already registered using another method",
          });
        }
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email and password" });
      }

      const sessionToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Login successful",
        sessionToken,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.log("Login failed", error);
      res
        .status(500)
        .json({ error: "Failed to login user. Please try again later" });
    }
  });
};
module.exports = signIn;
