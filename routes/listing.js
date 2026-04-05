const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');

// GET all listings
router.get('/', 
  wrapAsync(
  async(req, res,next) => {
 
    const listings = await Listing.find();
    res.render('listing.ejs', { listings });
  
})

)


// NEW form
router.get('/new', (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be logged in to create a listing.');
    return res.redirect('/login');
  }
  res.render('new.ejs');
});

// CREATE listing
router.post('/', 
  wrapAsync(async (req, res,next) => {
  
     const newListing = new Listing(req.body.listing);
     req.flash('success', 'Listing created successfully!');
    await newListing.save();
    res.redirect('/listings');
 
  })
  
);

// SHOW single listing
router.get('/:id', 
  wrapAsync(async (req, res) => {
 
    const listing = await Listing.findById(req.params.id).populate('reviews');
    res.render('show.ejs', { listing });

})
)

// EDIT form
router.get('/:id/edit', 
  wrapAsync(async (req, res) => {
  
    const listing = await Listing.findById(req.params.id);
    res.render('edit.ejs', { listing });
  
})
)

// UPDATE listing
router.patch('/:id',
  wrapAsync(async (req, res) => {

    const { id } = req.params;
    const { title, description, image, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, { title, description, image, price, location, country },  { returnDocument: 'after' }) // ✅ modern option);
       req.flash('success', 'Listing updated successfully!');

    res.redirect('/listings');
 
})
)

// DELETE listing
router.delete('/:id', 
  wrapAsync(async (req, res,next) => {
    await Listing.findByIdAndDelete(req.params.id);
      req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');
   
})
)

module.exports = router;