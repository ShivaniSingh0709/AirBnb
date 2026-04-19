 const Listing = require('../models/listing');
const Review = require('../models/review.js');

module.exports.createReview = async (req, res) => {
let listing = await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);

newReview.author = req.user._id; // Associate review with logged-in user   
console.log('New Review:', newReview);

listing.reviews.push(newReview);
await newReview.save();
await listing.save();
     req.flash('success', 'New Review Added!');

res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id: listingId, reviewId } = req.params;

    await Listing.findByIdAndUpdate(listingId, {
        $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${listingId}`);
}