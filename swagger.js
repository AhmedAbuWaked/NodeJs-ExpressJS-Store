const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "My API",
    description: "Description",
  },
  host: "localhost:5000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./routes/category"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./server.js"); // Your project's root file
});
