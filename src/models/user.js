const mongoose = require("mongoose");
const { isEmail, isURL, isStrongPassword } = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => isEmail(value),
        message: "Email is not valid",
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      select: false,
      validate: {
        validator: (value) => isStrongPassword(value),
        message: "Password is not strong enough",
      },
    },
    age: {
      type: Number,
      min: 18,
      required: true,
    },
    gender: {
      type: String,
      lowercase: true,
      required: true,
      validate: {
        validator: (v) => v == null || ["male", "female", "other"].includes(v),
        message: "Gender data is not valid",
      },
    },
    photoUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (url) =>
          isURL(url, {
            protocols: ["http", "https"],
            require_tld: true,
            require_protocol: true,
          }) || url == null,
        message: "Photo URL is not valid",
      },
      default:
        "https://as1.ftcdn.net/jpg/07/95/95/14/1000_F_795951406_h17eywwIo36DU2L8jXtsUcEXqPeScBUq.jpg",
    },
    about: {
      type: String,
      trim: true,
      maxLength: 500,
      default: "Hey there! I am using DevTinder.",
    },
    skills: {
      type: [String],
      default: [],
      validate: [
        {
          validator: (skills) => Array.isArray(skills) && skills.length <= 10,
          message: "You can add upto 10 skills",
        },
        {
          validator: (skills) => {
            const normalizedData = skills.map((skill) =>
              skill.toLowerCase().trim()
            );
            return new Set(normalizedData).size === normalizedData.length;
          },
          message: "Duplicate skills are not allowed",
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWTToken = async function () {
  const user = this;

  // Create JWT token which expires in 7 days
  const token = await jwt.sign({ _id: user._id }, "DevTinderAppSecretKey@123", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.comparePassword = async function (plainTextPswd) {
  const user = this;
  console.log("User password hash:", user.password, plainTextPswd);
  if (typeof plainTextPswd !== "string" || typeof user.password !== "string")
    return false;
  console.log("Comparing passwords:", plainTextPswd, user.password);
  const isPasswordValid = await bcrypt.compare(plainTextPswd, user.password);
  return isPasswordValid;
};

const User = model("User", userSchema);

module.exports = User;
