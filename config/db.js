const mongoose = require("mongoose");
const colors = require("colors");

const db = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URI, {
      autoIndex: true,
    });
    console.log(
      colors.bold.green(`Database Connected: ${connection.connection.host}`)
    );
  } catch (err) {
    console.error("🚀 ~ file: db.js ~ line 13 ~ db ~ err", err.message);
  }
};

module.exports = db;
