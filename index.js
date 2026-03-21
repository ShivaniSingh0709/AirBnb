const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
let port = 8181;
const path = require('path');
const ejsMate = require('ejs-mate');

app.set('views',path.join(__dirname,'views'));  
app.use(express.static(path.join(__dirname,'public')));

var methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.engine('ejs',ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Connect to MongoDB
async function connectToDatabase() {
  try {
    const DB_URL =
      process.env.MONGO_URI ||
      "mongodb://localhost:27017/airbnb";

    await mongoose.connect(DB_URL);

    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error("Error connecting to MongoDB ❌:", error);
  }
}

// Call function AFTER definition
connectToDatabase();

// Define a simple route
app.get("/", (req, res) => {
    res.redirect("/listings");
});
//Get and Save Sample Listing
app.get('/testListing',(req,res) =>{
    let sampleListing = new Listing({
        title: "My new Villa",
        description: "by the beach",
        price:1200,
        location:"Goa",
        Country:"India"
    })
    sampleListing.save();
    res.send("Successful saved");
})
app.get('/listings',async(req,res)=>{
    
    let listings = await Listing.find();
    res.render('listing.ejs',{listings});


})
app.get('/listings/new',(req,res)=>{
    res.render('new.ejs');
})
app.post('/listings',(req,res)=>{
    // console.log('added');
    // let { title, description, image, price, location, country } = req.body;
//    let listing = req.body.listing;
//    console.log(listing);
    const newListing = new Listing( req.body.listing);
    newListing.save()
    .then((result)=>{
        console.log('saved listing')
        res.redirect('/listings');
    })
    .catch((err)=>{
        console.log(err)
    })
})
app.get('/listings/:id',async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
        res.render('show.ejs',{listing});

})
app.get('/listings/:id/edit', async(req,res) =>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render('edit.ejs',{listing});
})
app.patch('/listings/:id',(req,res) =>{
    let {id} = req.params;
    let { title, description, image, price, location, country } = req.body;
console.log(req.body);
Listing.findByIdAndUpdate(id,{title,description,image,price,location,country},{new:true})
.then((result)=>{
    console.log(`updated ${result}`);
    res.redirect('/listings');
})
.catch((err)=>{
    console.log(`${err}`)
})
    // let listing = req.body;
    // console.log(listing);
})

app.delete('/listings/:id',async(req,res)=>{
    let {id} = req.params;
    let listDeleted = await Listing.findByIdAndDelete(id);
    console.log(listDeleted);
    // .then((result)=>
    // {
    //     console.log('deleted list'+`${result}`)
        res.redirect('/listings')
    // })
    // .catch((err)=>{
    //     console.log(`Error ${err}`)
    // })
})
// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});