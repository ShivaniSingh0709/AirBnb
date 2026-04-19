const { Cursor } = require("mongoose");
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.session.redirectTo = req.originalUrl; // Store the original URL for redirecting after login
    req.flash('error', 'You must be logged in to create a listing.');
    return res.redirect('/login');
  }
    next();
}
module.exports.saveRedirectTo = (req, res, next) => {
  if (req.session.redirectTo) {
    res.locals.redirectTo = req.session.redirectTo;
  }
  next();
}


module.exports.isOwner = async(req, res, next) => {
  let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.Owner.equals(res.locals.currentUser._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/listings/${id}`);
  }
  next();
}
module.exports.isReviewAuthor = async(req, res, next) => {
  let {id, reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currentUser._id)) {

    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/listings/${id}`);
    
  }
  next();
  

}