const express = require("express");

const fs = require("fs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const flash = require("connect-flash");
const morgan = require("morgan");
const bodyparser = require('body-parser')
const limiter=require("./utils/limiter")
const addCSRF = require("./middlewares/addCSRF");

const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const dotenv = require("dotenv");
const path = require("path");

const dbConfig = require("./config/dbconfig");
dotenv.config();
// Connect to MongoDB using the configuration
dbConfig();

const courseModel = require("./db/courseDB");

const User = require("./db/User");
const isAuthenticated = require("./middlewares/isAuthenticated");

const app = express();


//Views folder should be accessible from anywhere..
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyparser.urlencoded({extended:true}));
// app.use(app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(morgan("dev"));

app.use(mongoSanitize());



//Regular middleware
app.use(cookieParser());
const csrf = require("csurf");

app.use(
  session({
    secret: process.env.SECRET_KEY,   
    resave: false,
    saveUninitialized: true,
  })
);       

app.use(csrf());
app.use(addCSRF)

app.use(flash());
// Initialize Passport and session middleware
require("./config/passportConfig");
app.use(passport.initialize());
app.use(passport.session());
//changes
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);



app.use("/courses", limiter, isAuthenticated, async function (req, res) {
  const courses = await courseModel.find();
  return res.render("course", { courses: courses });
});



app.use("/css", express.static("src/css"));

// user routes
const userRoutes=require("./routes/userRoutes")
app.use(userRoutes)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
