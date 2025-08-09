const resetPwd = (app) => {
  const bcrypt = require("bcrypt");
  const {User} = require("../../../model/user");
  const jwt = require("jsonwebtoken");
  const dotenv = require("dotenv");
  dotenv.config();

  app.post("/auth/reset-password", async (req, res) => {
    const { password, token } = req.body;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({
        _id: decoded.id,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Invalid or expired reset token" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.log("Error resetting password: ", error);
      res
        .status(500)
        .json({
          error: "cannot reset password at the moment, please try again later",
        });
    }
  });
};

module.exports = resetPwd;
