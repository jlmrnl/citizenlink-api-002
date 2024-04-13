
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const Senior = require("./src/routes/SeniorFormsRoutes");
const FourPs = require("./src/routes/_4PsFormsRoutes");
const authRoutes = require("./src/routes/authRoutes");
const SMTP = require("./src/routes/SMTPRoutes");
const linkRoutes = require("./src/routes/CMS");
const linkRoutes2 = require("./src/routes/CMS2");
const { connectToMongoDB } = require("./src/config/mongodbConfig");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/senior", Senior);
app.use("/api/4ps", FourPs);
app.use("/api/lgu", authRoutes);
app.use("/api/smtp", SMTP);
app.use("/api/link", linkRoutes);
app.use("/api/link2", linkRoutes2);

connectToMongoDB().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
