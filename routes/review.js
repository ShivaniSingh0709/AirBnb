const express = require('express');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');

const router = express.Router({ mergeParams: true }); // To access :id from listing routes

router.post('/',wrapAsync(async (req, res) => {
let listing = await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);

listing.reviews.push(newReview);
await newReview.save();
await listing.save();
     req.flash('success', 'New Review Added!');

res.redirect(`/listings/${listing._id}`);
}))
router.delete('/:reviewId',wrapAsync(async (req, res) => {
const { id: listingId, reviewId } = req.params;
await Listing.findByIdAndUpdate(listingId, {
  $pull: { reviews: reviewId }
});
    await Review.findByIdAndDelete(reviewId);
     req.flash('success', 'Review deleted successfully  !');

res.redirect(`/listings/${listingId}`);

}))
module.exports = router;