const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 9110;
const app = express();
app.use(express.json());

// ✅ Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization,x-user-data",
  }),
);

const fileUpload = require("express-fileupload");
app.use(
  fileUpload({
    limits: { fileSize: 100000000 },
  }),
);

// Mount all routes
app.use("/v1/api", require("./src/routes"));

// Health route
app.get("/", (req, res) => {
  res.send("Hello from main");
});

// 404 for any unmatched path — prevents silently returning 200 for mis-routed requests
app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.originalUrl });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log("service listening on port " + PORT);
});
