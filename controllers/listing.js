const Listing = require('../models/listing');

module.exports.index =   async(req, res,next) => {
 
    const listings = await Listing.find();
    res.render('listing.ejs', { listings });
  
}

module.exports.renderNewForm = async(req, res) => {
  
  res.render('new.ejs');
}

module.exports.createListing =async (req, res,next) => {
   let url = req.file.path;
   let filename = req.file.filename;
     const newListing = new Listing(req.body.listing);
     newListing.Owner = req.user._id; // Associate listing with logged-in user
     newListing.image = { url, filename }; // Store image URL and filename in listing
     req.flash('success', 'Listing created successfully!');
    await newListing.save();
    res.redirect('/listings');
 
  }

module.exports.showListing = async (req, res) => {
 
    const listing = await Listing.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('Owner');
    res.render('show.ejs', { listing });

}

module.exports.renderEditForm = async (req, res) => {
  
    const listing = await Listing.findById(req.params.id);
    res.render('edit.ejs', { listing });
  
}

module.exports.updateListing = async (req, res) => {

    const { id } = req.params;
    const { title, description, image, price, location, country } = req.body.listing;
    // if(!currentUser && listing.Owner.equals(req.currentUser._id)) {
    //   req.flash('error', 'You do not have permission to do that!');
    //   return res.redirect(`/listings/${id}`);
    // }
   let listing = await Listing.findByIdAndUpdate(id, { title, description, image, price, location, country },  { returnDocument: 'after' }) // ✅ modern option);
      if (typeof req.file !== 'undefined') {
     let url = req.file.path;
   let filename = req.file.filename;
   listing.image = { url, filename }; // Update image URL and filename in listing 
    await listing.save();
      }
    req.flash('success', 'Listing updated successfully!');

    res.redirect('/listings/' + id);
  }

  module.exports.destroyListing = async (req, res,next) => {
    await Listing.findByIdAndDelete(req.params.id);
      req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');
   
}
