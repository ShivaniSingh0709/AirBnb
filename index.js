if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
console.log(process.env);




const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');

const ExpressError = require('./utils/expressError.js');
const listingRoutes = require('./routes/listing.js');
const reviewRoutes = require('./routes/review.js');
const  userRoutes = require('./routes/user.js');

const User = require('./models/user.js');


const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Middleware & View Engine
// app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let port = process.env.PORT || 8181;

// ✅ CONNECT TO MONGODB AND START SERVER
async function startServer() {
  try {
    const DB_URL =
      process.env.MONGO_URI || "mongodb://localhost:27017/airbnb";

    await mongoose.connect(DB_URL, { serverSelectionTimeoutMS: 30000 });
    console.log("✅ MongoDB Connected");

    // Start server AFTER DB connection
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
}

// Call startServer to connect DB and start server
startServer();

//Session configuration

const sessionOptions = {
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Home redirect
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
    res.locals.error = req.flash('error'); // ✅ important
    res.locals.currentUser = req.user; // ✅ important for navbar

  next();
});



app.use('/listings', listingRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});
// ✅ ERROR HANDLER
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
});
