const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');

let port = process.env.PORT || 8181;

// Middleware & View Engine
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ CONNECT TO MONGODB AND START SERVER
async function startServer() {
  try {
    const DB_URL =
      process.env.MONGO_URI || "mongodb://localhost:27017/airbnb";

    await mongoose.connect(DB_URL, { serverSelectionTimeoutMS: 30000 });
    console.log("✅ MongoDB Connected");

    // Start server AFTER DB connection
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });

  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error);
  }
}

// Call startServer to connect DB and start server
startServer();

// ROUTES

// Home redirect
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Test sample listing
app.get('/testListing', async (req, res) => {
  try {
    const sampleListing = new Listing({
      title: "My new Villa",
      description: "by the beach",
      price: 1200,
      location: "Goa",
      country: "India"
    });
    await sampleListing.save();
    res.send("Successfully saved");
  } catch (err) {
    console.log(err);
    res.send("Error saving sample listing");
  }
});

// GET all listings
app.get('/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.render('listing.ejs', { listings });
  } catch (err) {
    console.log(err);
    res.send("Error fetching listings");
  }
});

// NEW form
app.get('/listings/new', (req, res) => {
  res.render('new.ejs');
});

// CREATE listing
app.post('/listings', async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
  } catch (err) {
    console.log(err);
    res.send("Error creating listing");
  }
});

// SHOW single listing
app.get('/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    res.render('show.ejs', { listing });
  } catch (err) {
    console.log(err);
    res.send("Listing not found");
  }
});

// EDIT form
app.get('/listings/:id/edit', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    res.render('edit.ejs', { listing });
  } catch (err) {
    console.log(err);
    res.send("Listing not found");
  }
});

// UPDATE listing
app.patch('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, { title, description, image, price, location, country },  { returnDocument: 'after' }) // ✅ modern option);
    res.redirect('/listings');
  } catch (err) {
    console.log(err);
    res.send("Error updating listing");
  }
});

// DELETE listing
app.delete('/listings/:id', async (req, res) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.redirect('/listings');
  } catch (err) {
    console.log(err);
    res.send("Error deleting listing");
  }
});