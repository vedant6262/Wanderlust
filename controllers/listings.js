const { response } = require("express");
const Listing = require("../models/listings.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const categories = Listing.schema.path("category").enumValues;

module.exports.index = async (req, res) => {
  const { category, search } = req.query;

  let query = {}; 

  if (category) {
    query.category = category;
  }

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const allistings = await Listing.find(query); 
  res.render("listings/index.ejs", { allistings });
};


module.exports.rendernewform=(req, res) => {
  res.render("listings/new.ejs", { categories});
};

module.exports.showlisting =async (req, res) => {
  const { id } = req.params;
const listing = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author",
    },
  })
  .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested does not exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createlisting = async (req, res) => {
  const geoResponse = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
    .send();

  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.geometry = geoResponse.body.features[0].geometry;

  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    newlisting.image = { url, filename };
  }
  let savedlisting =await newlisting.save();
  console.log(savedlisting);
  await newlisting.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};


  module.exports.rendereditform=async (req, res) => {
      const { id } = req.params;
      const listing = await Listing.findById(id);
  
      if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
      }
      let originalImageUrl = listing.image.url;
originalImageUrl = originalImageUrl.replace(
  "/upload",
  "/upload/w_250"
);

      res.render("listings/edit.ejs", { listing,originalImageUrl,categories });
    };

module.exports.updatelisting=async (req, res) => {
    const { id } = req.params;
    let listing =await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    
  if (typeof req.file!=="undefined") {   
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    await listing.save();
  }
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
  }
  
  module.exports.destroyListing =async (req, res) => {
      const { id } = req.params;
      await Listing.findByIdAndDelete(id);
  
      req.flash("success", "Listing deleted");
      res.redirect("/listings");
    }