const User = require('../models/user.js');

module.exports.registeredUser = async (req, res) => {
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
}

module.exports.loggedInUser = async function(req, res) {
    try {
    req.flash('success', `Welcome, ${req.user.username}! to WanderLust!`);
    res.redirect(res.locals.redirectTo || '/listings');
    } catch (e) {
        console.log("❌ ERROR:", e);
        req.flash('error', 'Login failed. Please try again.');
        res.redirect('/login');
    }
  }
  module.exports.logoutUser = (req,res) => {
    req.logout(function(err) {
        if (err) { 
            console.log("❌ LOGOUT ERROR:", err);       
            req.flash('error', 'Logout failed. Please try again.');
            return res.redirect('/listings');
        }   
        req.flash('success', 'Logged out successfully!');
        res.redirect('/listings');
    });
  }