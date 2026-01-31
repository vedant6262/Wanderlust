const Review = require("../models/review.js");
const Listing = require("../models/listings.js"); 


module.exports.createreview =async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newreview = new Review(req.body.review);
    newreview.author=req.user._id;
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();
    req.flash("success", "New review created");
    res.redirect(`/listings/${listing._id}`);
  }

  module.exports.destroyreview =async (req, res) => {
      const { id, reviewId } = req.params;
  
      await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
      });
  
      await Review.findByIdAndDelete(reviewId);
  
      req.flash("success", "Review Deleted");
      res.redirect(`/listings/${id}`);
    }