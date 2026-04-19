const express = require('express');
const router = express.Router(); // To access :id from listing routes
const wrapAsync = require('../utils/wrapAsync.js');
const User = require('../models/user.js');
const passport = require('passport');
const { isLoggedIn, saveRedirectTo } = require('../middleware.js');
const userController = require('../controllers/user.js');



router.route('/register')
.get((req, res) => {
    res.render("signup.ejs");
})
.post(wrapAsync(userController.registeredUser))

router.route('/login')
.get((req, res) => {
    res.render("login.ejs");
})
.post(saveRedirectTo,
  passport.authenticate('local', { failureRedirect: '/login' }),
  userController.loggedInUser)
  
  router.get('/logout', userController.logoutUser);

module.exports = router;