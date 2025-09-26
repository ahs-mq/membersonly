const path = require("node:path");
const { Pool } = require("pg");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");
require('dotenv').config()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const app = express()
app.set("views",path.join(__dirname, "views"))
app.set("view engine", "ejs");
//initalize passport
app.use(passport.initialize());


app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//login strategy and usernamefiled set as email for login here
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "No account found with that email" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

//set cookies
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.get("/", (req,res)=>{
    res.render("index", {user: req.user})
})

app.get("/log-in", (req,res)=>{
    res.render("log-in")
})

//login page
app.post("/log-in",passport.authenticate("local", {successRedirect:"/", failureRedirect:"/"}))

app.get("/sign-up", (req,res)=>{
    res.render("sign-up")
})


app.post("/sign-up", async (req,res,next)=>{
    try{
        //insert login data into db
        const hashedpassword = await bcrypt.hash(req.body.password, 10);
        await pool.query("INSERT INTO users (first_name,last_name,email,password) VALUES ($1, $2, $3, $4)", [req.body.fname , req.body.lname, req.body.email, hashedpassword])
        res.redirect('/')
    
    } catch (err){
        console.log(err)
        next(err)
    }
})


app.listen(5000, ()=>{console.log("Listening on port 5000..")})