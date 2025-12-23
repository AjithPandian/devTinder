const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const { validateProfileData, encryptPassword } = require("../utils/validation");
const User = require("../models/user");
const e = require("express");
const { isStrongPassword } = require("validator");

const profileRouter = express.Router();

// Get the profile of logged in user
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

// Change the password
profileRouter.patch("/profile/change-password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      throw new Error("Old password is incorrect !");
    }
    if (!isStrongPassword(newPassword)) {
      throw new Error("New password is not strong enough");
    }

    user.password = await encryptPassword(newPassword);

    await user.save();

    res.json({
      message: `${user.firstName}, your password changed successfully !`,
    });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

// Update the profile of logged in user
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) throw new Error("Invalid profile data !!!");

    const user = req.user;
    Object.keys(req.body).forEach((field) => {
      user[field] = req.body[field];
    });

    await user.save();

    res.json({
      message: `${user.firstName}, your profile updated successfully !`,
      data: user,
    });
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = profileRouter;
