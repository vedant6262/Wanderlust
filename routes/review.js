const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapasync = require("../utils/wrapAsync.js"); 
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js"); 
const {validatereview, isLoggedin, isreviewAuthor} =require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js");

// CREATE review
router.post(
  "/",
  isLoggedin,
  validatereview,
  wrapasync(reviewcontroller.createreview)
);

// DELETE review
router.delete(
  "/:reviewId",
   isLoggedin,
   isreviewAuthor,
  wrapasync(reviewcontroller.destroyreview)
);

module.exports = router;
