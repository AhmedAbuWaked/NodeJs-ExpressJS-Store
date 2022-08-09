const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const colors = require("colors");
const db = require("./config/db");

dotenv.config({ path: "config.env" });

const routes = require("./routes");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/error");

// Connect with DB
db();

// Express App
const app = express();

// Middleware
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1", routes);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global Error Handling Middleware
app.use(globalError);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(colors.yellow(`App Running on Port ${PORT}`));
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log(colors.red(`Shutting down...`));
    process.exit(1);
  });
});
