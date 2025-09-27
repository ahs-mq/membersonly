
const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("./passportconfig");
const messageRoutes = require("./routes/messageRoutes");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", messageRoutes);
app.use("/", authRoutes);

app.listen(5000, () => console.log("Listening on port 5000..."));
