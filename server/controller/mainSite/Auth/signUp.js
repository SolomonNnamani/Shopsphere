const register = (app) => {
  const bcrypt = require("bcrypt");
  const {User} = require("../../../model/user");
  const createNotification = require("../../../utils/notificationUtil.js")


  app.post("/auth/sign-up", async (req, res) => {
    const { firstName, lastName, email,phone, password } = req.body;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        if (existingUser.provider === "google") {
          return res.status(400).json({
            exist:
              "This email is already registered using Google. Please sign in with Google",
          });
        } else if (existingUser.provider === "local") {
          return res.status(400).json({
            exist:
              "Email already registered. Please sign in or use a different email.",
          });
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        provider: "local",
      });
      await newUser.save();

      await createNotification({
        type: "new_customer",
        message: `New customer ${firstName} ${lastName} just registered`,
        relatedId:newUser._id,
        relatedModel: "User"
      })

      res
        .status(200)
        .json({ user: "Registration successful! Please sign in." });
    } catch (error) {
      console.log("Registeration error: ", error.message);
      res
        .status(500)
        .json({ error: "Failed to register user. Please try again later" });
    }
  });
};
module.exports = register;
