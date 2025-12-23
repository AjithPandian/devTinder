const express = require("express");
const { validateSignUpData, encryptPassword } = require("../utils/validation");
const User = require("../models/user");

const authRouter = express.Router();

// Creating a new user
authRouter.post("/signup", async (req, res) => {
  try {
    //Validating user data before saving to DB
    validateSignUpData(req);
    const { firstName, lastName, email, password, gender, age } = req.body;

    // Encrypt password before saving to DB
    const hashedPassword = await encryptPassword(password);

    const userObj = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      age,
    });

    await userObj.save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

// Login route
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) throw new Error("Invalid email or password");

    const isPasswordMatch = await user.comparePassword(password);
    console.log(isPasswordMatch);

    if (!isPasswordMatch) throw new Error("Invalid email or password");

    if (isPasswordMatch) {
      const token = await user.getJWTToken();

      // Expire cookie in 8 hours
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
    }

    res.send("Login successful!!!");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

// Logout route
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logout successful!!!");
});

module.exports = authRouter;
