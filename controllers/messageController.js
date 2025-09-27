const pool = require("../db/pool");

exports.getHome = async (req, res) => {
  try {
    //failsafe if user logged out
    let member = false;
    //check if logged in user bool value
    if (req.user) {
      const { rows } = await pool.query("SELECT membership FROM users WHERE id = $1", [req.user.id]);
      member = rows[0]?.membership || false;
    }

    const { rows: messages } = await pool.query("SELECT * FROM messages");
    res.render("index", { user: req.user, data: messages, anon: member });
  } catch (err) {
    console.log("Homepage error:", err);
    res.status(500).send("Server Error");
  }
};

exports.addMessage = async (req, res) => {
  try {
    await pool.query(
      "INSERT INTO messages (title, body, user_id) VALUES ($1, $2, $3)",
      [req.body.title, req.body.msg, req.user.id]
    );
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding message");
  }
};
