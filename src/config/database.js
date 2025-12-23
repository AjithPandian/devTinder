const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://namsate_dev_pandian_09:T9st5YYV99AK5iK3@namastenode.bx1igmt.mongodb.net/devTinder"
    );
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
