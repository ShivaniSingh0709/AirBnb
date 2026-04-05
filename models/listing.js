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
        type:String,
        default:"https://images.unsplash.com/photo-1723523422806-f35199efda7e?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set:(v) =>
            v === ""
              ? "https://images.unsplash.com/photo-1723523422806-f35199efda7e?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D":v,
    },
    location: String,
    country:String,
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
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