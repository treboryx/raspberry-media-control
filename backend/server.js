const express = require("express");
const morgan = require("morgan");
const colors = require("colors");
const moment = require("moment");
require("moment-duration-format");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const {
  setVolume,
  setMute,
  getVolume,
  getMute,
  paused,
  cmd,
} = require("./utils");

const app = express();
// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());
app.use(express.static("public"));
// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

app.post("/mute/:value", (req, res) => {
  setMute(req.params.value);
  res.json({ success: true });
});

app.post("/volume/:value", async (req, res) => {
  setVolume(req.params.value);
  res.json({ success: true });
});

app.post("/cmd/:value", async (req, res) => {
  const commands = ["Play", "Pause", "Next", "Previous"];
  if (!commands.includes(req.params.value)) return res.json({ succes: false });
  await cmd(req.params.value);
  res.json({ success: true });
});

app.get("/stats", async (req, res) => {
  const uptime = moment
    .duration(process.uptime(), "seconds")
    .format("w [weeks] d [days], h [hrs], m [min], s [sec]");
  const started = moment().subtract(process.uptime(), "seconds").format("llll");
  const volume = await getVolume();
  const mute = await getMute();
  res.json({
    success: true,
    data: { volume, mute, pause: paused, uptime, started },
  });
});

const PORT = process.env.PORT || 4000;
const server = app.listen(
  PORT,
  console.log(`Server running on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
