const express = require('express');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');
const router = express.Router({ mergeParams: true }); // To access :id from listing routes
const reviewController = require('../controllers/review.js');

router.post('/',isLoggedIn,wrapAsync(reviewController.createReview))

// routes/review.js
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));
module.exports = router;