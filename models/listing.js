const mongoose = require('mongoose');
const Review = require('./review.js');

const listingScheme = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    price: Number,
    image: {
     url: String,
     filename: String
    },
    location: String,
    country:String,
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
    Owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    category:{
        type: String,
        enum: ['Trending','Iconic Cities','Beachfront', 'Mountain','Rooms', 'Arctic', 'Camping', 'Farms','Amazing Pools']
    }    
});

listingScheme.post('findOneAndDelete', async function(listing){ {
    if(listing){
        await Review.deleteMany({
            _id: {
                $in: listing.reviews
            }
        })
    }
}})
const Listing = mongoose.model('Listing', listingScheme);

module.exports= Listing;