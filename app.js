const dotenv = require("dotenv").config();
require("express-async-errors");

//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const express = require("express");
const app = express();
const authRouter = require("./routes/auth.routes");
const accommodations = require("./routes/accommodations.routes");

const scheduler = require("./functions/scheduler");
const connectDB = require("./db/connect");

app.set("trust proxy", 1);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.get("/", (req, res) => {
  res.send("Casta API");
});

//Routes
app.use("/api/v1/accommodations", accommodations);
app.use("/auth", authRouter);

//Connection to DB then server starts listening on defined port.
const port = process.env.PORT || 3010;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

scheduler.init();

start();
