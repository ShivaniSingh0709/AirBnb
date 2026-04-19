

const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn,isOwner } = require('../middleware.js');
const listingController = require('../controllers/listing.js');
const { storage } = require('../cloudConfig.js');
const multer  = require('multer');
const upload = multer({ storage });

router.route('/')
  .get(wrapAsync(listingController.index))
  .post(
  isLoggedIn,
    upload.single('listing[image]'),

  wrapAsync(listingController.createListing)

);
  router.get('/category/:category',async (req, res) => {
  const { category } = req.params;
  const listings = await Listing.find({ category });

    res.render('listing.ejs', { listings });
});
// NEW form
router.get('/new',
   isLoggedIn,
    listingController.renderNewForm
   );

router.route('/:id')
.get(wrapAsync(listingController.showListing))
.patch(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),

  wrapAsync(listingController.updateListing)
)
.delete( isLoggedIn,isOwner,
  wrapAsync(listingController.destroyListing)

)




// EDIT form
router.get('/:id/edit', 
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
)


module.exports = router;