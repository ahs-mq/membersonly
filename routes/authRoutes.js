const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");

router.get("/log-in", authController.getLogin);
router.post("/log-in", passport.authenticate("local", {
  successRedirect: "/auth",
  failureRedirect: "/sign-up"
}));

router.get("/sign-up", authController.getSignup);
router.post("/sign-up", authController.postSignup);

router.get("/auth", authController.getAuth);
router.post("/auth", authController.postAuth);

router.get("/log-out", authController.logout);

module.exports = router;
