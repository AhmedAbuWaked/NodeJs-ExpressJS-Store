const mongoose = require("mongoose");
const colors = require("colors");

const db = () => {
  mongoose
    .connect(process.env.DB_URI, {
      autoIndex: true,
    })
    .then((connection) => {
      console.log(
        colors.bold.green(`Database Connected: ${connection.connection.host}`)
      );
    });
  // .catch((err) => {
  //   console.log(
  //     "🚀 ~ file: server.js ~ line 12 ~ mongoose.connect ~ err",
  //     err
  //   );
  //   process.exit(1);
  // });
};

module.exports = db;
