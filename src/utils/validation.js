const { isEmail, isStrongPassword } = require("validator");
const bcrypt = require("bcrypt");
const { ALLOWED_UPDATES } = require("../constants");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid !");
  } else if (!isEmail(email)) {
    throw new Error("Email is not valid !");
  } else if (!isStrongPassword(password)) {
    throw new Error("Password is not strong enough !");
  }
};

const encryptPassword = async (password) => {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("Invalid password");
  }
  const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (err) {
    throw new Error("Failed to encrypt password");
  }
};

const validateProfileData = (req) => {
  return Object.keys(req.body).every((field) =>
    ALLOWED_UPDATES.includes(field)
  );
};

module.exports = {
  validateSignUpData,
  encryptPassword,
  validateProfileData,
};
