const express = require('express');
const router = express.Router(); // To access :id from listing routes
const wrapAsync = require('../utils/wrapAsync.js');
const User = require('../models/user.js');
const passport = require('passport');

router.get('/register', (req, res) => {

    res.render("signup.ejs");
});
router.post('/register', wrapAsync(async (req, res) => {
    console.log("🔥 REGISTER ROUTE HIT"); // 👈 MUST PRINT

    try {
        let { email, username, password } = req.body;
        console.log("BODY:", req.body);

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        console.log("✅ USER CREATED:", registeredUser);

        req.flash('success', 'Welcome to WanderLust!');
        res.redirect('/listings');
    } catch (e) {
        console.log("❌ ERROR:", e);
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render("login.ejs");
});
router.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  async function(req, res) {
    try {
    req.flash('success', `Welcome, ${req.user.username}! to WanderLust!`);
    res.redirect('/listings');
    } catch (e) {
        console.log("❌ ERROR:", e);
        req.flash('error', 'Login failed. Please try again.');
        res.redirect('/login');
    }
  });
module.exports = router;