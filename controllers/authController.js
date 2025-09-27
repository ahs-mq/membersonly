const pool = require("../db/pool");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res) => res.render("log-in", { user: req.user });

exports.getSignup = (req, res) => res.render("sign-up");

exports.postSignup = async (req, res, next) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",
      [req.body.fname, req.body.lname, req.body.email, hashed]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getAuth = (req, res) => res.render("auth", { user: req.user });

exports.postAuth = async (req, res) => {
  try {
    if (req.body.passcode === process.env.PASSCODE) {
      await pool.query("UPDATE users SET membership = TRUE WHERE id = $1", [req.user.id]);
      res.redirect("/");
    } else {
      res.status(401).send("Incorrect passcode");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

exports.logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
};
